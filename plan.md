# plan.md — AgroLink.ml (FARM Stack)

## 1. Objectives
- Deliver a premium minimalist bilingual (PT default / EN toggle) corporate agribusiness website for agrolink.ml.
- Provide a full admin panel (JWT email/password) to manage catalog/content: Products, Categories, Partners, Team Members, Quote Enquiries, Site Settings.
- Store all content in MongoDB and render via FastAPI APIs (no hardcoded catalog/content).
- Seed realistic bilingual data (4 product categories) + contact settings (email + Angola/Namibia phones).
- Ensure responsive UX, fast interactions, and baseline SEO (titles/meta/OG) in both languages.

## 2. Implementation Steps

### Phase 1 — Core Build (No POC needed)
**User stories**
1. As a visitor, I can switch PT/EN in the header and my choice persists across pages.
2. As a visitor, I can browse products by category and open a product detail page.
3. As a visitor, I can submit a quote request that is saved and acknowledged.
4. As an admin, I can log in and create/edit/publish products and categories.
5. As an admin, I can view quote enquiries and update their status.

**Backend (FastAPI + MongoDB)**
- Project setup: FastAPI app, Mongo connection, env config, CORS.
- Data models/collections (bilingual fields where relevant):
  - `categories` (name_pt/name_en, slug, order, active)
  - `products` (name_pt/name_en, short_desc_pt/en, desc_pt/en, category_id, images[], specs[], applications_pt/en, packaging_pt/en, availability_pt/en, featured, status)
  - `team` (name, role_pt/en, bio_pt/en, photo, order, active)
  - `partners` (name, logo(optional), url(optional), order, active) **(no fake logos; allow empty/placeholder)**
  - `enquiries` (full_name, company, email, phone, country, interest, quantity, message, lang, status, timestamps)
  - `settings` (email, angola_phone, namibia_phone, social/whatsapp links)
  - `admins` (email, password_hash)
- Auth: JWT login, protected admin routes.
- CRUD APIs: categories/products/team/partners/settings + enquiries create/list/update.
- Seed script:
  - Create initial admin user.
  - Insert categories + 20–40 realistic bilingual sample products across 4 categories.
  - Insert 2–4 placeholder team entries.
  - Insert settings with provided contact details.

**Frontend (React)**
- App shell: routing, layout, sticky header, footer.
- i18n architecture:
  - Translation dictionaries (PT/EN) for UI chrome.
  - Language context/provider with PT default; toggle persists in `localStorage`.
  - API-driven content uses `*_pt/*_en` fields based on current language.
- Core pages:
  - Home (hero, value props, sections as specified, partners placeholder).
  - Products (filters + grid).
  - Product Detail (Request Quote CTA).
  - Contact (quote/enquiry form + WhatsApp buttons).
  - About (mission/vision/values + Team section).
  - Solutions + Agribusiness (content sections, CTA).
- Admin:
  - `/admin/login` (email/password)
  - `/admin` dashboard
  - CRUD screens for categories/products/team/partners/settings
  - enquiries inbox with status updates
- Styling: Tailwind (or equivalent) with defined palette; Inter/Manrope; rounded cards, subtle shadows; minimal micro-interactions.
- SEO: per-route title/meta/OG with PT/EN variants.

**Checkpoint**
- Run app end-to-end: language toggle, product browse, enquiry submit, admin CRUD.

**Testing (end of phase)**
- Call testing agent for a full pass:
  - PT default + toggle persistence
  - products list/detail
  - enquiry submission stored + visible in admin
  - admin CRUD for at least one product/category/team member

### Phase 2 — V1 Polish & Content Completeness
**User stories**
1. As a visitor, I can quickly understand AgroLink’s value and categories from the homepage sections.
2. As a visitor, I can see clearly formatted specs/packaging/applications on product pages.
3. As a visitor, I can use WhatsApp buttons to contact the right branch.
4. As an admin, I can upload/manage multiple product images and team photos.
5. As an admin, I can set “featured” products that appear on the homepage.

- Improve homepage sections: how-it-works timeline, why-agrolink benefits, sectors cards, CTA blocks.
- Add media handling:
  - Simple image upload/store (local static or S3-like later); ensure display works.
- Enquiry status lifecycle (New → In Progress → Closed) and filtering.
- Add empty/loading/error states across pages.
- Ensure partner section supports real logos later; keep placeholder UI.

**Testing (end of phase)**
- Testing agent: responsive checks, form validation, media upload/display, featured products rendering.

### Phase 3 — Production Readiness & Refinements
**User stories**
1. As a visitor, I get fast page loads and smooth navigation on mobile.
2. As a visitor, I can share a product link with correct OG preview.
3. As an admin, I can search products/enquiries quickly.
4. As an admin, I can safely manage content without breaking bilingual display.
5. As an owner, I can export enquiries for offline follow-up.

- Add search/sort in Products and Admin lists.
- Add sitemap-friendly routing + robots/meta defaults.
- Harden auth/security (rate-limit login, stronger password policy, token expiry/refresh if needed).
- Add export CSV for enquiries.
- Cleanup/refactor for modularity (API client, hooks, reusable components).

**Testing (end of phase)**
- Testing agent: regression pass across public + admin; confirm no broken bilingual strings or missing fields.

## 3. Next Actions
1. Run `design_agent` to lock the component styling system (palette, typography, spacing, card/button styles) + page wireframes.
2. Implement backend models + CRUD + seed (including admin user + sample bilingual products).
3. Implement React app shell + i18n provider + core public pages (Home/Products/Detail/Contact/About).
4. Implement admin login + CRUD screens + enquiries inbox.
5. Execute testing agent on the complete Phase 1 build and fix all issues before polishing.

## 4. Success Criteria
- PT is default everywhere; EN toggle works site-wide and persists.
- All content is bilingual (UI + DB-driven fields) with no missing translations shown.
- Products are fully dynamic from MongoDB, filterable, and scalable.
- Enquiry form reliably saves to DB and is manageable in admin.
- Admin panel supports CRUD for Products/Categories/Team/Partners/Settings and status updates for enquiries.
- Visual design matches premium minimalist agribusiness branding; responsive on mobile/desktop.
- Testing agent confirms all critical user flows work without regressions.

---
## STATUS LOG
### Phase 1 — Core Build: COMPLETE (verified)
- Backend: FastAPI + MongoDB, JWT auth, full CRUD (products/categories/team/partners/enquiries/settings), bilingual data model, seeded 4 categories + 21 bilingual products + 3 team placeholders + real contact settings. 31/31 backend tests passed.
- Frontend: PT default + EN toggle (persists), Home/About(team)/Products(filters)/ProductDetail/Solutions/Agribusiness/Contact(quote form + WhatsApp Angola/Namibia), premium green/gold design per design_guidelines.md, Manrope font, framer-motion reveals.
- Admin: /admin/login (admin@agrolink.ml / Agrolink@2025), dashboard stats, products/categories/team/partners CRUD, enquiries inbox w/ status, settings. Product creation via UI verified manually with Playwright (/app/tests/qa_admin_test.py).
- Testing agent full pass: backend 100%, frontend 95% (only automation harness flake on dialog fill; verified working manually).
### Next (Phase 2 candidates): image upload (vs URL), enquiry CSV export, admin search improvements, blog/news.
