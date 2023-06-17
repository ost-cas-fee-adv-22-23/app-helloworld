import { expect, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

// https://playwright.dev/docs/auth
setup('authenticate', async ({ page }) => {
  const userName = 'hello-world-tester@smartive.zitadel.cloud';
  const password = 'disPfdHWTU5?';
  const url = 'http://localhost:3000';

  await page.goto(url);
  await page.getByText("Let's mumble").click();

  const input = page.getByPlaceholder('username@domain');
  await input.fill(userName);
  await page.getByText('next').click();

  await page.waitForSelector('input[name="password"]').then((field) => field.fill(password));
  await page.getByText('next').click();

  await expect(page.getByText('Willkommen auf Mumble')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
