import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

describe('index page', function () {
  const indexPageUrl = 'https://app-helloworld-1.vercel.app/';
  test('[#01] should verify default texts', async ({ page }) => {
    // Arrange
    const pageTitle = 'Mumble - The best social network!';
    const title = 'Willkommen auf Mumble';
    const subtitle = 'Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.';
    const altTextProfile = 'Profilbild';
    const settingsButtonText = 'Settings';
    const logoutButtonText = 'Logout';

    // Act
    await page.goto(indexPageUrl);

    // Assert
    await expect(page).toHaveTitle(pageTitle);
    await expect(page.getByAltText(altTextProfile)).toBeVisible();
    await expect(page.getByRole('button', { name: settingsButtonText })).toBeVisible();
    await expect(page.getByRole('button', { name: logoutButtonText })).toBeVisible();
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(subtitle)).toBeVisible();
  });

  // TODO: find out why this test is flaky.
  test('[#02] should add new post', async ({ page }) => {
    // Arrange
    const mumbleText = `e2e-Test Spam um: ${Date.now()}`;
    const mumblePlaceholder = 'Deine Meinung zählt?';
    const sendButtonText = 'absenden';

    // Act
    await page.goto(indexPageUrl);
    const textArea = await page.getByPlaceholder(mumblePlaceholder);
    await expect(textArea).toBeVisible();
    await textArea.fill(mumbleText);
    await expect(page.getByText(mumbleText)).toBeVisible();

    await page.getByText(sendButtonText).waitFor();
    await page.getByText(sendButtonText).click();

    // Assert
    await expect(page.getByText(mumbleText)).toBeVisible();
  });

  test('[#03/01] should navigate to profile page', async ({ page }) => {
    // Arrange
    const profileUrl = 'https://app-helloworld-1.vercel.app/profile/me';
    const altTextProfile = 'Profilbild';

    // Act
    await page.goto(indexPageUrl);
    await page.getByAltText(altTextProfile).first().click();

    // Assert
    await expect(page).toHaveURL(profileUrl);
  });

  test('[#03/02] should navigate to mumble page', async ({ page }) => {
    // Arrange
    const mumbleUrl = /.*mumble/;
    const commentButton = 'Comment';

    // Act
    await page.goto(indexPageUrl);
    await page.getByRole('link', { name: commentButton }).first().click();

    // Assert
    await expect(page).toHaveURL(mumbleUrl);
  });
});
