"""
Backend API Testing for AgroLink.ml
Tests all backend endpoints with proper authentication and validation
"""
import requests
import sys
from datetime import datetime

BASE_URL = "https://agro-connect-82.preview.emergentagent.com/api"

class APITester:
    def __init__(self):
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.failures = []
        self.test_data = {}

    def log(self, message, level="INFO"):
        """Log test messages"""
        prefix = "✅" if level == "PASS" else "❌" if level == "FAIL" else "🔍"
        print(f"{prefix} {message}")

    def test(self, name, method, endpoint, expected_status, data=None, headers=None, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        h = {'Content-Type': 'application/json'}
        if self.token:
            h['Authorization'] = f'Bearer {self.token}'
        if headers:
            h.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=h, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=h, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=h, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=h, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"PASSED - Status: {response.status_code}", "PASS")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.tests_failed += 1
                self.log(f"FAILED - Expected {expected_status}, got {response.status_code}", "FAIL")
                try:
                    error_detail = response.json()
                    self.log(f"Response: {error_detail}", "FAIL")
                except:
                    self.log(f"Response: {response.text[:200]}", "FAIL")
                self.failures.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint
                })
                return False, {}

        except Exception as e:
            self.tests_failed += 1
            self.log(f"FAILED - Error: {str(e)}", "FAIL")
            self.failures.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 70)
        print("🚀 AGROLINK.ML BACKEND API TESTING")
        print("=" * 70)

        # ===== AUTH TESTS =====
        print("\n" + "=" * 70)
        print("🔐 AUTHENTICATION TESTS")
        print("=" * 70)

        # Test 1: Login with valid credentials
        success, response = self.test(
            "Login with valid credentials",
            "POST",
            "/auth/login",
            200,
            data={"email": "admin@agrolink.ml", "password": "Agrolink@2025"}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.log(f"Token obtained: {self.token[:20]}...", "PASS")
        else:
            self.log("CRITICAL: Cannot proceed without token", "FAIL")
            return self.print_summary()

        # Test 2: Login with invalid credentials
        self.test(
            "Login with invalid credentials returns 401",
            "POST",
            "/auth/login",
            401,
            data={"email": "admin@agrolink.ml", "password": "wrongpassword"}
        )

        # Test 3: Get current user
        self.test(
            "Get authenticated user info",
            "GET",
            "/auth/me",
            200
        )

        # ===== CATEGORIES TESTS =====
        print("\n" + "=" * 70)
        print("📁 CATEGORIES TESTS")
        print("=" * 70)

        # Test 4: Get all categories (public)
        success, response = self.test(
            "Get all active categories",
            "GET",
            "/categories",
            200
        )
        if success and len(response) > 0:
            self.test_data['categories'] = response
            self.log(f"Found {len(response)} categories", "PASS")
            if len(response) >= 4:
                self.log("Expected 4 categories found", "PASS")
            else:
                self.log(f"Expected 4 categories, found {len(response)}", "FAIL")

        # ===== PRODUCTS TESTS =====
        print("\n" + "=" * 70)
        print("📦 PRODUCTS TESTS")
        print("=" * 70)

        # Test 5: Get all products
        success, response = self.test(
            "Get all active products",
            "GET",
            "/products",
            200
        )
        if success:
            self.test_data['products'] = response
            self.log(f"Found {len(response)} products", "PASS")

        # Test 6: Get featured products
        success, response = self.test(
            "Get featured products",
            "GET",
            "/products",
            200,
            params={"featured": "true"}
        )
        if success:
            self.log(f"Found {len(response)} featured products", "PASS")

        # Test 7: Filter products by category
        if self.test_data.get('categories'):
            cat_slug = self.test_data['categories'][0]['slug']
            success, response = self.test(
                f"Filter products by category: {cat_slug}",
                "GET",
                "/products",
                200,
                params={"category": cat_slug}
            )

        # Test 8: Get specific product by slug
        success, response = self.test(
            "Get product by slug: hybrid-maize-seed",
            "GET",
            "/products/hybrid-maize-seed",
            200
        )

        # Test 9: Get non-existent product returns 404
        self.test(
            "Get non-existent product returns 404",
            "GET",
            "/products/non-existent-product-xyz",
            404
        )

        # ===== ENQUIRIES TESTS =====
        print("\n" + "=" * 70)
        print("📧 ENQUIRIES TESTS")
        print("=" * 70)

        # Test 10: Create enquiry (public)
        success, response = self.test(
            "Create enquiry with required fields",
            "POST",
            "/enquiries",
            201,
            data={
                "full_name": "Test User",
                "email": "test@example.com",
                "phone": "+244 900 000 000",
                "company": "Test Company",
                "country": "Angola",
                "product_interest": "Hybrid Maize Seed",
                "quantity": "100 bags",
                "message": "Test enquiry message",
                "lang": "pt"
            }
        )
        if success and 'id' in response:
            self.test_data['enquiry_id'] = response['id']
            self.log(f"Enquiry created with ID: {response['id']}", "PASS")

        # Test 11: Get all enquiries (admin only)
        success, response = self.test(
            "Get all enquiries (admin)",
            "GET",
            "/admin/enquiries",
            200
        )
        if success:
            self.log(f"Found {len(response)} enquiries", "PASS")

        # Test 12: Update enquiry status
        if self.test_data.get('enquiry_id'):
            self.test(
                "Update enquiry status to in_progress",
                "PUT",
                f"/admin/enquiries/{self.test_data['enquiry_id']}/status",
                200,
                data={"status": "in_progress"}
            )

        # Test 13: Unauthenticated access to admin enquiries
        temp_token = self.token
        self.token = None
        self.test(
            "Unauthenticated access to admin enquiries returns 401",
            "GET",
            "/admin/enquiries",
            401
        )
        self.token = temp_token

        # ===== ADMIN PRODUCTS CRUD =====
        print("\n" + "=" * 70)
        print("🛠️  ADMIN PRODUCTS CRUD TESTS")
        print("=" * 70)

        # Test 14: Get admin products
        success, response = self.test(
            "Get all products (admin)",
            "GET",
            "/admin/products",
            200
        )

        # Test 15: Create new product
        if self.test_data.get('categories'):
            cat_id = self.test_data['categories'][0]['id']
            success, response = self.test(
                "Create new product",
                "POST",
                "/admin/products",
                201,
                data={
                    "name_pt": "Produto de Teste",
                    "name_en": "Test Product",
                    "slug": f"test-product-{datetime.now().strftime('%H%M%S')}",
                    "category_id": cat_id,
                    "short_desc_pt": "Descrição curta",
                    "short_desc_en": "Short description",
                    "desc_pt": "Descrição completa do produto de teste",
                    "desc_en": "Full description of test product",
                    "applications_pt": ["Teste 1", "Teste 2"],
                    "applications_en": ["Test 1", "Test 2"],
                    "packaging_pt": "Sacos de 50 kg",
                    "packaging_en": "50 kg bags",
                    "specifications": [
                        {"label_pt": "Peso", "label_en": "Weight", "value": "50 kg"}
                    ],
                    "images": ["https://images.unsplash.com/photo-1560493676-04071c5f467b"],
                    "featured": False,
                    "availability": "in_stock",
                    "status": "active"
                }
            )
            if success and 'id' in response:
                self.test_data['test_product_id'] = response['id']
                self.log(f"Product created with ID: {response['id']}", "PASS")

        # Test 16: Duplicate slug rejected
        if self.test_data.get('categories'):
            cat_id = self.test_data['categories'][0]['id']
            self.test(
                "Create product with duplicate slug returns 400",
                "POST",
                "/admin/products",
                400,
                data={
                    "name_pt": "Outro Produto",
                    "name_en": "Another Product",
                    "slug": "hybrid-maize-seed",  # Existing slug
                    "category_id": cat_id,
                    "status": "active"
                }
            )

        # Test 17: Update product
        if self.test_data.get('test_product_id'):
            self.test(
                "Update product",
                "PUT",
                f"/admin/products/{self.test_data['test_product_id']}",
                200,
                data={
                    "name_pt": "Produto de Teste Atualizado",
                    "name_en": "Updated Test Product",
                    "slug": f"test-product-{datetime.now().strftime('%H%M%S')}",
                    "category_id": self.test_data['categories'][0]['id'],
                    "status": "active"
                }
            )

        # Test 18: Delete product
        if self.test_data.get('test_product_id'):
            self.test(
                "Delete product",
                "DELETE",
                f"/admin/products/{self.test_data['test_product_id']}",
                200
            )

        # ===== ADMIN CATEGORIES CRUD =====
        print("\n" + "=" * 70)
        print("📂 ADMIN CATEGORIES CRUD TESTS")
        print("=" * 70)

        # Test 19: Get admin categories
        self.test(
            "Get all categories (admin)",
            "GET",
            "/admin/categories",
            200
        )

        # Test 20: Create category
        success, response = self.test(
            "Create new category",
            "POST",
            "/admin/categories",
            201,
            data={
                "name_pt": "Categoria de Teste",
                "name_en": "Test Category",
                "slug": f"test-category-{datetime.now().strftime('%H%M%S')}",
                "desc_pt": "Descrição de teste",
                "desc_en": "Test description",
                "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
                "order": 99,
                "active": True
            }
        )
        if success and 'id' in response:
            self.test_data['test_category_id'] = response['id']

        # Test 21: Delete category (should fail if has products)
        # We'll try to delete a category with products
        if self.test_data.get('categories') and len(self.test_data['categories']) > 0:
            cat_with_products = self.test_data['categories'][0]['id']
            self.test(
                "Delete category with products returns 400",
                "DELETE",
                f"/admin/categories/{cat_with_products}",
                400
            )

        # Test 22: Delete empty category
        if self.test_data.get('test_category_id'):
            self.test(
                "Delete empty category",
                "DELETE",
                f"/admin/categories/{self.test_data['test_category_id']}",
                200
            )

        # ===== ADMIN TEAM CRUD =====
        print("\n" + "=" * 70)
        print("👥 ADMIN TEAM CRUD TESTS")
        print("=" * 70)

        # Test 23: Get team members
        success, response = self.test(
            "Get all team members (admin)",
            "GET",
            "/admin/team",
            200
        )

        # Test 24: Create team member
        success, response = self.test(
            "Create team member",
            "POST",
            "/admin/team",
            201,
            data={
                "name": "Test Team Member",
                "role_pt": "Testador",
                "role_en": "Tester",
                "bio_pt": "Biografia de teste",
                "bio_en": "Test biography",
                "photo": "",
                "order": 99,
                "active": True
            }
        )
        if success and 'id' in response:
            self.test_data['test_team_id'] = response['id']

        # Test 25: Delete team member
        if self.test_data.get('test_team_id'):
            self.test(
                "Delete team member",
                "DELETE",
                f"/admin/team/{self.test_data['test_team_id']}",
                200
            )

        # ===== ADMIN PARTNERS CRUD =====
        print("\n" + "=" * 70)
        print("🤝 ADMIN PARTNERS CRUD TESTS")
        print("=" * 70)

        # Test 26: Get partners
        self.test(
            "Get all partners (admin)",
            "GET",
            "/admin/partners",
            200
        )

        # Test 27: Create partner
        success, response = self.test(
            "Create partner",
            "POST",
            "/admin/partners",
            201,
            data={
                "name": "Test Partner",
                "logo": "https://via.placeholder.com/150",
                "url": "https://example.com",
                "order": 99,
                "active": True
            }
        )
        if success and 'id' in response:
            self.test_data['test_partner_id'] = response['id']

        # Test 28: Delete partner
        if self.test_data.get('test_partner_id'):
            self.test(
                "Delete partner",
                "DELETE",
                f"/admin/partners/{self.test_data['test_partner_id']}",
                200
            )

        # ===== ADMIN SETTINGS =====
        print("\n" + "=" * 70)
        print("⚙️  ADMIN SETTINGS TESTS")
        print("=" * 70)

        # Test 29: Get settings
        success, response = self.test(
            "Get site settings",
            "GET",
            "/settings",
            200
        )
        if success:
            self.log(f"Settings email: {response.get('email', 'N/A')}", "PASS")

        # Test 30: Update settings
        self.test(
            "Update site settings",
            "PUT",
            "/admin/settings",
            200,
            data={
                "email": "agrolink.ml@gmail.com",
                "phone_angola": "+244 924 546 980",
                "phone_namibia": "+264 85 379 4593",
                "whatsapp_angola": "+244924546980",
                "whatsapp_namibia": "+264853794593"
            }
        )

        # ===== ADMIN STATS =====
        print("\n" + "=" * 70)
        print("📊 ADMIN STATS TESTS")
        print("=" * 70)

        # Test 31: Get admin stats
        success, response = self.test(
            "Get admin dashboard stats",
            "GET",
            "/admin/stats",
            200
        )
        if success:
            self.log(f"Products: {response.get('products', 0)}", "PASS")
            self.log(f"Categories: {response.get('categories', 0)}", "PASS")
            self.log(f"Enquiries: {response.get('enquiries_total', 0)}", "PASS")

        return self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failures:
            print("\n" + "=" * 70)
            print("❌ FAILED TESTS DETAILS")
            print("=" * 70)
            for i, failure in enumerate(self.failures, 1):
                print(f"\n{i}. {failure['test']}")
                print(f"   Endpoint: {failure.get('endpoint', 'N/A')}")
                if 'expected' in failure:
                    print(f"   Expected: {failure['expected']}, Got: {failure['actual']}")
                if 'error' in failure:
                    print(f"   Error: {failure['error']}")
        
        print("\n" + "=" * 70)
        return 0 if self.tests_failed == 0 else 1


if __name__ == "__main__":
    tester = APITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
