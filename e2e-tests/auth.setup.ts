import { expect, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

// https://playwright.dev/docs/auth
setup('authenticate', async ({ page }) => {
  await page.goto(process.env.NEXT_PUBLIC_QWACKER_API_URL ?? '');
  await page.getByText("Let's mumble").click();

  const input = page.getByPlaceholder('username@domain');
  await input.fill(process.env.E2E_TEST_USER_NAME ?? '');
  await page.getByText('next').click();

  await page.waitForSelector('input[name="password"]').then((field) => field.fill(process.env.E2E_TEST_USER_PASSWORD ?? ''));
  await page.getByText('next').click();

  await expect(page.getByText('Willkommen auf Mumble')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
