import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

// https://playwright.dev/docs/auth
setup('authenticate', async ({ page }) => {
  await page.goto('https://app-helloworld-1.vercel.app/login/');
  await page.getByText("Let's mumble").click();
  await page.getByPlaceholder('user@domain').fill(process.env.TEST_USER_NAME ?? '');
  await page.getByText('weiter').click();
  await page.waitForSelector('input[name="password"]').then((field) => field.fill(process.env.TEST_USER_PASSWORD ?? ''));
  await page.getByText('weiter').click();
  await page.getByText('Willkommen auf Mumble').isVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
