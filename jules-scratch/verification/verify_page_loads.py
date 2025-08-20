import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for all console events and print them
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        page.goto('http://localhost:8000')

        try:
            textarea = page.locator('#textarea')
            expect(textarea).to_have_css('background-color', 'rgb(255, 0, 0)')
            page.screenshot(path="jules-scratch/verification/verification.png")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
            raise

        browser.close()

if __name__ == "__main__":
    run_verification()
