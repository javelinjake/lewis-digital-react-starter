import { expect, test } from '@playwright/test'

test('opens the batting session without signing in and highlights a moment', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Batting practice' })).toBeVisible()
  await page.locator('#moment-front-foot').getByRole('button').click()
  await expect(page.getByText('Step towards the pitch of the ball. Keep your head steady as your weight moves into the shot.')).toBeVisible()
  await expect(page.getByText(/Viewing moment/)).toBeVisible()
})
