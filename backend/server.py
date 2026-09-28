from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'agrolink-dev-secret')
JWT_ALGO = 'HS256'
JWT_EXPIRY_HOURS = 24 * 7

app = FastAPI(title="AgroLink.ml API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("agrolink")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def now_iso():
    return datetime.now(timezone.utc).isoformat()


def serialize_doc(doc):
    """Recursively convert Mongo docs to JSON-safe dicts (drop _id, ISO datetimes)."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        return {k: serialize_doc(v) for k, v in doc.items() if k != '_id'}
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False


def create_token(admin_id: str, email: str) -> str:
    payload = {
        'sub': admin_id,
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def require_admin(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    admin = await db.admins.find_one({"id": payload.get('sub')})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return serialize_doc(admin)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class LoginInput(BaseModel):
    email: EmailStr
    password: str


class Specification(BaseModel):
    label_pt: str = ""
    label_en: str = ""
    value: str = ""


class CategoryInput(BaseModel):
    name_pt: str
    name_en: str
    slug: str
    desc_pt: str = ""
    desc_en: str = ""
    image: str = ""
    order: int = 0
    active: bool = True


class ProductInput(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name_pt: str
    name_en: str
    slug: str
    category_id: str
    short_desc_pt: str = ""
    short_desc_en: str = ""
    desc_pt: str = ""
    desc_en: str = ""
    applications_pt: List[str] = []
    applications_en: List[str] = []
    packaging_pt: str = ""
    packaging_en: str = ""
    specifications: List[Specification] = []
    images: List[str] = []
    featured: bool = False
    availability: str = "in_stock"  # in_stock | on_request
    status: str = "active"  # active | draft


class TeamInput(BaseModel):
    name: str
    role_pt: str = ""
    role_en: str = ""
    bio_pt: str = ""
    bio_en: str = ""
    photo: str = ""
    order: int = 0
    active: bool = True


class PartnerInput(BaseModel):
    name: str
    logo: str = ""
    url: str = ""
    order: int = 0
    active: bool = True


class EnquiryInput(BaseModel):
    full_name: str
    company: str = ""
    email: EmailStr
    phone: str = ""
    country: str = ""
    product_interest: str = ""
    quantity: str = ""
    message: str = ""
    lang: str = "pt"


class EnquiryStatusInput(BaseModel):
    status: str  # new | in_progress | closed


class SettingsInput(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str = ""
    phone_angola: str = ""
    phone_namibia: str = ""
    whatsapp_angola: str = ""
    whatsapp_namibia: str = ""
    address_angola: str = ""
    address_namibia: str = ""
    facebook: str = ""
    instagram: str = ""
    linkedin: str = ""


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------

@api_router.post("/auth/login")
async def login(data: LoginInput):
    admin = await db.admins.find_one({"email": data.email.lower()})
    if not admin or not verify_password(data.password, admin.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(admin['id'], admin['email'])
    return {"token": token, "email": admin['email'], "name": admin.get('name', 'Admin')}


@api_router.get("/auth/me")
async def me(admin=Depends(require_admin)):
    return {"email": admin['email'], "name": admin.get('name', 'Admin')}


# ---------------------------------------------------------------------------
# Public routes
# ---------------------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"message": "AgroLink.ml API", "status": "ok"}


@api_router.get("/categories")
async def list_categories():
    cats = await db.categories.find({"active": True}).sort("order", 1).to_list(200)
    return serialize_doc(cats)


@api_router.get("/products")
async def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    availability: Optional[str] = None,
    limit: int = Query(100, le=500),
):
    q: Dict[str, Any] = {"status": "active"}
    if category:
        cat = await db.categories.find_one({"$or": [{"id": category}, {"slug": category}]})
        if cat:
            q["category_id"] = cat["id"]
        else:
            q["category_id"] = category
    if featured is not None:
        q["featured"] = featured
    if availability:
        q["availability"] = availability
    if search:
        q["$or"] = [
            {"name_pt": {"$regex": search, "$options": "i"}},
            {"name_en": {"$regex": search, "$options": "i"}},
            {"short_desc_pt": {"$regex": search, "$options": "i"}},
            {"short_desc_en": {"$regex": search, "$options": "i"}},
        ]
    products = await db.products.find(q).sort("created_at", -1).to_list(limit)
    return serialize_doc(products)


@api_router.get("/products/{slug_or_id}")
async def get_product(slug_or_id: str):
    product = await db.products.find_one({"$or": [{"slug": slug_or_id}, {"id": slug_or_id}], "status": "active"})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_doc(product)


@api_router.get("/team")
async def list_team():
    team = await db.team.find({"active": True}).sort("order", 1).to_list(100)
    return serialize_doc(team)


@api_router.get("/partners")
async def list_partners():
    partners = await db.partners.find({"active": True}).sort("order", 1).to_list(100)
    return serialize_doc(partners)


@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"id": "site-settings"})
    return serialize_doc(settings) or {}


@api_router.post("/enquiries", status_code=201)
async def create_enquiry(data: EnquiryInput):
    doc = data.model_dump()
    doc.update({
        "id": str(uuid.uuid4()),
        "status": "new",
        "created_at": now_iso(),
        "updated_at": now_iso(),
    })
    await db.enquiries.insert_one(doc)
    return serialize_doc(doc)


# ---------------------------------------------------------------------------
# Admin routes (protected)
# ---------------------------------------------------------------------------

# ----- Stats -----
@api_router.get("/admin/stats")
async def admin_stats(admin=Depends(require_admin)):
    products = await db.products.count_documents({})
    active_products = await db.products.count_documents({"status": "active"})
    categories = await db.categories.count_documents({})
    enquiries_total = await db.enquiries.count_documents({})
    enquiries_new = await db.enquiries.count_documents({"status": "new"})
    team = await db.team.count_documents({})
    partners = await db.partners.count_documents({})
    recent = await db.enquiries.find({}).sort("created_at", -1).to_list(5)
    return {
        "products": products,
        "active_products": active_products,
        "categories": categories,
        "enquiries_total": enquiries_total,
        "enquiries_new": enquiries_new,
        "team": team,
        "partners": partners,
        "recent_enquiries": serialize_doc(recent),
    }


# ----- Categories -----
@api_router.get("/admin/categories")
async def admin_categories(admin=Depends(require_admin)):
    cats = await db.categories.find({}).sort("order", 1).to_list(500)
    return serialize_doc(cats)


@api_router.post("/admin/categories", status_code=201)
async def create_category(data: CategoryInput, admin=Depends(require_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    await db.categories.insert_one(doc)
    return serialize_doc(doc)


@api_router.put("/admin/categories/{cat_id}")
async def update_category(cat_id: str, data: CategoryInput, admin=Depends(require_admin)):
    res = await db.categories.update_one({"id": cat_id}, {"$set": data.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    cat = await db.categories.find_one({"id": cat_id})
    return serialize_doc(cat)


@api_router.delete("/admin/categories/{cat_id}")
async def delete_category(cat_id: str, admin=Depends(require_admin)):
    count = await db.products.count_documents({"category_id": cat_id})
    if count > 0:
        raise HTTPException(status_code=400, detail=f"Category has {count} products. Move or delete them first.")
    res = await db.categories.delete_one({"id": cat_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"deleted": True}


# ----- Products -----
@api_router.get("/admin/products")
async def admin_products(search: Optional[str] = None, category: Optional[str] = None,
                         status: Optional[str] = None, admin=Depends(require_admin)):
    q: Dict[str, Any] = {}
    if search:
        q["$or"] = [
            {"name_pt": {"$regex": search, "$options": "i"}},
            {"name_en": {"$regex": search, "$options": "i"}},
        ]
    if category:
        q["category_id"] = category
    if status:
        q["status"] = status
    products = await db.products.find(q).sort("created_at", -1).to_list(1000)
    return serialize_doc(products)


@api_router.post("/admin/products", status_code=201)
async def create_product(data: ProductInput, admin=Depends(require_admin)):
    existing = await db.products.find_one({"slug": data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="A product with this slug already exists")
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    doc["updated_at"] = now_iso()
    await db.products.insert_one(doc)
    return serialize_doc(doc)


@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, data: ProductInput, admin=Depends(require_admin)):
    existing = await db.products.find_one({"slug": data.slug, "id": {"$ne": product_id}})
    if existing:
        raise HTTPException(status_code=400, detail="A product with this slug already exists")
    update = data.model_dump()
    update["updated_at"] = now_iso()
    res = await db.products.update_one({"id": product_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    product = await db.products.find_one({"id": product_id})
    return serialize_doc(product)


@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(require_admin)):
    res = await db.products.delete_one({"id": product_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": True}


# ----- Team -----
@api_router.get("/admin/team")
async def admin_team(admin=Depends(require_admin)):
    team = await db.team.find({}).sort("order", 1).to_list(500)
    return serialize_doc(team)


@api_router.post("/admin/team", status_code=201)
async def create_team_member(data: TeamInput, admin=Depends(require_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    await db.team.insert_one(doc)
    return serialize_doc(doc)


@api_router.put("/admin/team/{member_id}")
async def update_team_member(member_id: str, data: TeamInput, admin=Depends(require_admin)):
    res = await db.team.update_one({"id": member_id}, {"$set": data.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    member = await db.team.find_one({"id": member_id})
    return serialize_doc(member)


@api_router.delete("/admin/team/{member_id}")
async def delete_team_member(member_id: str, admin=Depends(require_admin)):
    res = await db.team.delete_one({"id": member_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"deleted": True}


# ----- Partners -----
@api_router.get("/admin/partners")
async def admin_partners(admin=Depends(require_admin)):
    partners = await db.partners.find({}).sort("order", 1).to_list(500)
    return serialize_doc(partners)


@api_router.post("/admin/partners", status_code=201)
async def create_partner(data: PartnerInput, admin=Depends(require_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    await db.partners.insert_one(doc)
    return serialize_doc(doc)


@api_router.put("/admin/partners/{partner_id}")
async def update_partner(partner_id: str, data: PartnerInput, admin=Depends(require_admin)):
    res = await db.partners.update_one({"id": partner_id}, {"$set": data.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    partner = await db.partners.find_one({"id": partner_id})
    return serialize_doc(partner)


@api_router.delete("/admin/partners/{partner_id}")
async def delete_partner(partner_id: str, admin=Depends(require_admin)):
    res = await db.partners.delete_one({"id": partner_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"deleted": True}


# ----- Enquiries -----
@api_router.get("/admin/enquiries")
async def admin_enquiries(status: Optional[str] = None, search: Optional[str] = None,
                          admin=Depends(require_admin)):
    q: Dict[str, Any] = {}
    if status:
        q["status"] = status
    if search:
        q["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"product_interest": {"$regex": search, "$options": "i"}},
        ]
    enquiries = await db.enquiries.find(q).sort("created_at", -1).to_list(1000)
    return serialize_doc(enquiries)


@api_router.put("/admin/enquiries/{enquiry_id}/status")
async def update_enquiry_status(enquiry_id: str, data: EnquiryStatusInput, admin=Depends(require_admin)):
    if data.status not in ("new", "in_progress", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.enquiries.update_one(
        {"id": enquiry_id},
        {"$set": {"status": data.status, "updated_at": now_iso()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry = await db.enquiries.find_one({"id": enquiry_id})
    return serialize_doc(enquiry)


@api_router.delete("/admin/enquiries/{enquiry_id}")
async def delete_enquiry(enquiry_id: str, admin=Depends(require_admin)):
    res = await db.enquiries.delete_one({"id": enquiry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"deleted": True}


# ----- Settings -----
@api_router.put("/admin/settings")
async def update_settings(data: SettingsInput, admin=Depends(require_admin)):
    update = data.model_dump()
    update["updated_at"] = now_iso()
    await db.settings.update_one({"id": "site-settings"}, {"$set": update}, upsert=True)
    settings = await db.settings.find_one({"id": "site-settings"})
    return serialize_doc(settings)


# ---------------------------------------------------------------------------
# Seed on startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def seed_database():
    from seed_data import CATEGORIES, PRODUCTS, TEAM, SETTINGS

    if await db.admins.count_documents({}) == 0:
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@agrolink.ml').lower()
        admin_password = os.environ.get('ADMIN_PASSWORD', 'Agrolink@2025')
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "AgroLink Admin",
            "password_hash": hash_password(admin_password),
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user: %s", admin_email)

    if await db.categories.count_documents({}) == 0:
        for c in CATEGORIES:
            c["created_at"] = now_iso()
        await db.categories.insert_many([dict(c) for c in CATEGORIES])
        logger.info("Seeded %d categories", len(CATEGORIES))

    if await db.products.count_documents({}) == 0:
        for p in PRODUCTS:
            p["created_at"] = now_iso()
            p["updated_at"] = now_iso()
        await db.products.insert_many([dict(p) for p in PRODUCTS])
        logger.info("Seeded %d products", len(PRODUCTS))

    if await db.team.count_documents({}) == 0:
        for t in TEAM:
            t["created_at"] = now_iso()
        await db.team.insert_many([dict(t) for t in TEAM])
        logger.info("Seeded %d team members", len(TEAM))

    if await db.settings.count_documents({"id": "site-settings"}) == 0:
        s = dict(SETTINGS)
        s["updated_at"] = now_iso()
        await db.settings.insert_one(s)
        logger.info("Seeded site settings")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
