import os
from playwright.sync_api import sync_playwright, expect
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for all console events and print them
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        page.goto('http://localhost:8000')
        time.sleep(10)
        print(page.content())

        try:
            # Wait for the first command's output to be visible
            terminal_output = page.locator('p:has-text("i am happiest when i am right next to you.")')
            expect(terminal_output).to_be_visible(timeout=15000)
            page.screenshot(path="jules-scratch/verification/verification.png")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
            raise

        browser.close()

if __name__ == "__main__":
    run_verification()
