import asyncio
from playwright.async_api import async_playwright

BASE = "https://agro-connect-82.preview.emergentagent.com"

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 800})
        page.on("console", lambda m: print("CONSOLE:", m.type, m.text[:200]) if m.type == "error" else None)
        page.on("pageerror", lambda e: print("PAGEERROR:", str(e)[:300]))

        await page.goto(f"{BASE}/admin/login", wait_until="domcontentloaded", timeout=45000)
        await page.wait_for_selector('[data-testid="admin-login-email"]', timeout=20000)
        await page.fill('[data-testid="admin-login-email"]', "admin@agrolink.ml")
        await page.fill('[data-testid="admin-login-password"]', "Agrolink@2025")
        await page.click('[data-testid="admin-login-submit"]')
        try:
            await page.wait_for_url("**/admin", timeout=15000)
            print("STEP1 OK: logged in ->", page.url)
        except Exception as e:
            print("STEP1 FAIL:", e, "| url:", page.url)
            body = await page.inner_text("body")
            print("BODY:", body[:300])
            await browser.close()
            return

        await page.click('[data-testid="admin-nav-products"]')
        await page.wait_for_selector('[data-testid="admin-products-add-button"]', timeout=15000)
        await page.wait_for_selector('[data-testid="admin-product-row"]', timeout=15000)
        print("STEP2 OK: products table loaded")

        await page.click('[data-testid="admin-products-add-button"]')
        await page.wait_for_selector('[data-testid="product-form-name-pt"]', timeout=10000)
        await page.fill('[data-testid="product-form-name-pt"]', "Produto Teste QA4")
        await page.fill('[data-testid="product-form-name-en"]', "QA4 Test Product")
        # check category select value
        cat_text = await page.inner_text('[data-testid="product-form-category"]')
        print("Category select shows:", repr(cat_text))
        await page.click('[data-testid="product-form-save-button"]')
        await asyncio.sleep(3)
        body = await page.inner_text("body")
        if "QA4" in body:
            print("STEP3 OK: product created and visible")
        else:
            print("STEP3 FAIL: not visible. Toasts/body sample:", body[:200])

        # cleanup if created
        rows = page.locator('[data-testid="admin-product-row"]').filter(has_text="QA4")
        if await rows.count() > 0:
            await rows.first.locator('[data-testid="admin-product-delete-button"]').click()
            await page.wait_for_selector('[data-testid="confirm-delete-button"]', timeout=8000)
            await page.click('[data-testid="confirm-delete-button"]')
            await asyncio.sleep(2)
            print("Cleanup done")
        await browser.close()

asyncio.run(main())
