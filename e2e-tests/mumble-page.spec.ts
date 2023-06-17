import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

describe('mumble:id page', function () {
  const mumbleUrl = 'http://localhost:3000/mumble/01H1C7VH4CTJRC86GM6ZC8DB49';

  test.beforeEach(async ({ page }) => {
    await page.goto(mumbleUrl);
  });

  test('[#01] should add new comment', async ({ page }) => {
    // Arrange
    const comment = `e2e-Test Kommentar um: ${Date.now()}`;
    const mumbleText = 'e2e-Test Spam :-) um: 1685111809391';
    const commentPlaceholder = 'Und was meinst du dazu?';
    const sendButtonText = 'Absenden';

    // Act
    await expect(page.getByText(mumbleText)).toBeVisible();

    const textArea = await page.getByPlaceholder(commentPlaceholder);
    await expect(textArea).toBeVisible();
    await textArea.fill(comment);
    await expect(page.getByText(comment)).toBeVisible();

    const submitButton = await page.getByText(sendButtonText);
    await submitButton.click();
    await page.goto(mumbleUrl);

    // Assert
    await expect(page.getByText(comment)).toBeVisible();
  });

  // test('[#02] should copy link to mumble', async ({ page }) => {
  //   // Arrange
  //   const copyButtonText = 'Copy Link';
  //
  //   // Act
  //   const copyButton = await page.getByText(copyButtonText);
  //   await copyButton.first().click();
  //   const clipboardText = await page.evaluate('navigator.clipboard.readText()');
  //   // Assert
  //   expect(clipboardText).toEqual(mumbleUrl);
  // });

  test('[#03] should like mumble', async ({ page }) => {
    // Arrange
    const likeButtonText = 'Like';
    const likedButtonText = 'Liked';

    // Act
    const likeButton = await page.getByText(likeButtonText);
    await likeButton.first().click();

    // Assert
    await expect(page.getByText(likedButtonText)).toBeVisible();

    // undo change
    await likeButton.first().click();
  });
});
