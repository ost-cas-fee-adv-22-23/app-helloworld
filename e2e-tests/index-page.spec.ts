import { expect, test } from '@playwright/test';

test('[#01] should verify default texts', async ({ page }) => {
  // Arrange
  const title = 'Willkommen auf Mumble';
  const subtitle = 'Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.';

  // Act
  await page.goto('https://app-helloworld-1.vercel.app/');

  // Assert
  await expect(page).toHaveTitle(/Mumble - The best social network!/);
  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByText(subtitle)).toBeVisible();
});

test('[#02] should add new post', async ({ page }) => {
  // Arrange
  const text = `e2e-Test Spam :-) um: ${Date.now()}`;

  // Act
  await page.goto('https://app-helloworld-1.vercel.app/');
  const textArea = await page.getByPlaceholder('Deine Meinung zählt?');
  await expect(textArea).toBeVisible();
  await textArea.fill(text);
  await expect(page.getByText(text)).toBeVisible();
  const submitButton = await page.getByText('Absenden');
  await submitButton.click();

  // Assert
  await expect(page.getByText(text)).toBeVisible();
});
