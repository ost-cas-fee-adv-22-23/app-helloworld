import { expect, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

// https://playwright.dev/docs/auth
setup('authenticate', async ({ page }) => {
  const userName = 'hello-world-tester@smartive.zitadel.cloud';
  const password = 'disPfdHWTU5?';
  const url = 'http://localhost:3000';

  await page.goto(url);
  const letsMumbleButton = await page.getByText("Let's mumble");
  await letsMumbleButton.click();

  const input = page.getByPlaceholder('username@domain');
  await input.fill(userName);

  const nextButton = await page.getByText('next');
  await nextButton.click();

  await page.waitForSelector('input[name="password"]').then((field) => field.fill(password));
  const loginButton = await page.getByText('next');
  await loginButton.click();

  try {
    if (await page.getByText('skip').isVisible()) {
      await page.getByText('skip').click();
    }
  } catch (e) {
    console.log('2 factor authentication page does not exist.');
  }

  await expect(page.getByText('Willkommen auf Mumble')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
