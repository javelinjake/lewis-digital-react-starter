import { expect, test } from '@playwright/test'

test('signs in with the mock account and shows the welcome note', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('demo@lewisdigital.co.uk')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
  await page.getByRole('link', { name: 'Notes' }).click()
  await expect(page.getByText('Welcome')).toBeVisible()
})
