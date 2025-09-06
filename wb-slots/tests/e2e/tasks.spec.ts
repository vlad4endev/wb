import { test, expect } from '@playwright/test';

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'demo@wb-slots.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new task', async ({ page }) => {
    await page.goto('/tasks/new');
    
    await page.fill('input[name="name"]', 'Test Task');
    await page.fill('textarea[name="description"]', 'Test task description');
    
    // Select warehouses
    await page.check('input[type="checkbox"][value="1"]');
    
    // Set cron schedule
    await page.fill('input[name="scheduleCron"]', '*/15 * * * *');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show the new task
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('should show task list on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show tasks section
    await expect(page.locator('text=Мои задачи')).toBeVisible();
  });

  test('should run task manually', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click run button for first task
    const runButton = page.locator('button:has-text("Play")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      
      // Should show success or loading state
      await expect(page.locator('text=Выполняется')).toBeVisible();
    }
  });
});
