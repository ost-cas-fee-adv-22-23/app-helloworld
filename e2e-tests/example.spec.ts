import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://app-helloworld-1.vercel.app/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mumble - The best social network!/);
});
