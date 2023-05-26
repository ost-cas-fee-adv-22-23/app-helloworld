import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://app-helloworld-1.vercel.app/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mumble - The best social network!/);
  await page.getByText('Willkommen auf Mumble').isVisible();
  await page.getByText('Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.').isVisible();
});
