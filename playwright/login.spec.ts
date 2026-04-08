import { test, expect } from '@playwright/test'

test('User can sign in', async ({ page }) => {
  await page.goto('/auth/signin')

  // Fill in credentials
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')

  // Click sign in
  await page.click('button[type="submit"]')

  // Should redirect to home or account
  await expect(page).toHaveURL(/\/$|\/account$/)
})

test('Admin can sign in', async ({ page }) => {
  await page.goto('/auth/signin')

  // Fill in admin credentials
  await page.fill('input[name="email"]', 'admin@example.com')
  await page.fill('input[name="password"]', 'admin123')

  // Click sign in
  await page.click('button[type="submit"]')

  // Should redirect to admin
  await expect(page).toHaveURL(/\/admin/)
})