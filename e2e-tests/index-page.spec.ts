import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

describe('index page', function () {
  const indexPageUrl = 'https://app-helloworld-1.vercel.app/';
  test('[#01] should verify default texts', async ({ page }) => {
    // Arrange
    const pageTitle = 'Mumble - The best social network!';
    const title = 'Willkommen auf Mumble';
    const subtitle = 'Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.';

    // Act
    await page.goto(indexPageUrl);

    // Assert
    await expect(page).toHaveTitle(pageTitle);
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(subtitle)).toBeVisible();
  });

  test.only('[#02] should add new post', async ({ page }) => {
    // Arrange
    const mumbleText = `e2e-Test Spam um: ${Date.now()}`;
    const mumblePlaceholder = 'Deine Meinung zählt?';
    const sendButtonText = 'Absenden';

    // Act
    await page.goto(indexPageUrl);
    const textArea = await page.getByPlaceholder(mumblePlaceholder);
    await expect(textArea).toBeVisible();
    await textArea.fill(mumbleText);
    await expect(page.getByText(mumbleText)).toBeVisible();
    const submitButton = await page.getByText(sendButtonText);
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Assert
    await expect(page.getByText(mumbleText)).toBeVisible();
  });
});
