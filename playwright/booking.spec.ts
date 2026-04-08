import { test, expect } from '@playwright/test'

test('Homepage loads and has hero title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\//)
  await expect(page.locator('text=Réparation Voiture Professionnelle')).toBeVisible()
})

test('User can book a service', async ({ page }) => {
  // Sign in first
  await page.goto('/auth/signin')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/$|\/account$/)

  // Go to booking page
  await page.goto('/booking')

  // Step 1: Select service
  await page.selectOption('select[name="serviceId"]', { index: 1 }) // Select first service
  await page.click('button:has-text("Confirmer le service")')

  // Step 2: Select date and time
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateStr = tomorrow.toISOString().split('T')[0]
  await page.fill('input[type="date"]', dateStr)
  await page.selectOption('select[name="time"]', '10:00')
  await page.click('button:has-text("Valider")')

  // Step 3: Fill contact info
  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="phone"]', '+33123456789')
  await page.fill('textarea[name="notes"]', 'Test booking')

  // Submit booking
  await page.click('button:has-text("Confirmer le RDV")')

  // Should show success message
  await expect(page.locator('text=Réservation créée avec succès')).toBeVisible()
})
