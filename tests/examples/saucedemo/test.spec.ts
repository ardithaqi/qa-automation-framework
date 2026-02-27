import { test, expect } from "@playwright/test";

test("forced regression", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    expect(1).toBe(2);
});