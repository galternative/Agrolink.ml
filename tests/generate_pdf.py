"""Generate a PDF brochure of the AgroLink.ml website.
Takes full-page screenshots of each main page and combines them into one PDF.
Output: /app/frontend/public/agrolink-website.pdf (downloadable from the site).
"""
import asyncio
import io
from playwright.async_api import async_playwright
from PIL import Image

BASE = "https://agro-connect-82.preview.emergentagent.com"

PAGES = [
    ("/", "Início"),
    ("/about", "Sobre Nós"),
    ("/products", "Produtos"),
    ("/products/hybrid-maize-seed", "Detalhe de Produto"),
    ("/solutions", "Soluções"),
    ("/agribusiness", "Agronegócio"),
    ("/contact", "Contacto"),
]


async def capture(page, path):
    await page.goto(f"{BASE}{path}", wait_until="networkidle", timeout=60000)
    await asyncio.sleep(1.5)
    # Scroll through the page to trigger lazy-loaded images and reveal animations
    height = await page.evaluate("document.body.scrollHeight")
    step = 700
    pos = 0
    while pos < height:
        await page.evaluate(f"window.scrollTo(0, {pos})")
        await asyncio.sleep(0.35)
        pos += step
        height = await page.evaluate("document.body.scrollHeight")
    await page.evaluate("window.scrollTo(0, 0)")
    await asyncio.sleep(1.2)
    # Wait for all images to finish loading
    await page.evaluate(
        """() => Promise.all(Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(res => { img.onload = img.onerror = res; })))"""
    )
    await asyncio.sleep(0.5)
    shot = await page.screenshot(full_page=True, type="jpeg", quality=72)
    return Image.open(io.BytesIO(shot)).convert("RGB")


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        # Force Portuguese (default)
        await page.goto(BASE, wait_until="domcontentloaded", timeout=60000)
        await page.evaluate("localStorage.setItem('agrolink_lang', 'pt')")

        images = []
        for path, name in PAGES:
            print(f"Capturing {name} ({path}) ...")
            img = await capture(page, path)
            # Downscale slightly to keep PDF size reasonable
            w, h = img.size
            scale = 1100 / w
            img = img.resize((1100, int(h * scale)), Image.LANCZOS)
            images.append(img)
            print(f"  -> {img.size[0]}x{img.size[1]}")

        await browser.close()

    out = "/app/frontend/public/agrolink-website.pdf"
    images[0].save(out, save_all=True, append_images=images[1:], format="PDF", resolution=96)
    print(f"PDF saved: {out}")


asyncio.run(main())
