import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

describe('index page', function () {
  const indexPageUrl = 'http://localhost:3000';

  test('[#01/01] should navigate to profile page', async ({ page }) => {
    // Arrange
    const profileUrl = 'http://localhost:3000/profile/me';
    const altTextProfile = 'Profilbild';

    // Act
    await page.goto(indexPageUrl);
    await page.getByAltText(altTextProfile).first().click();

    // Assert
    await expect(page).toHaveURL(profileUrl);
  });

  test('[#01/02] should navigate to user page', async ({ page }) => {
    // Arrange
    const profileUrl = /.*profile/;

    // Act
    await page.goto(indexPageUrl);
    await page.getByTestId('profile-header').first().click();

    // Assert
    await expect(page).toHaveURL(profileUrl);
  });

  test('[#01/03] should navigate to mumble page', async ({ page }) => {
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
