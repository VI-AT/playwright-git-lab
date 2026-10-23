import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

type LoginCase = {
  name: string;
  email: string;
  password: string;
  expectedResult: string;
};

const jsonPath = path.join(__dirname, '..', 'test-data', 'login.json');
const jsonText = fs.readFileSync(jsonPath, 'utf8');
const loginCases = JSON.parse(jsonText) as LoginCase[];

for (const data of loginCases) {
  test(`JSON data: ${data.name}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/auth/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    await page.locator('[data-test="email"]').fill(data.email);
    await page.locator('[data-test="password"]').fill(data.password);
    await page.locator('[data-test="login-submit"]').click();

    if (data.expectedResult === 'success') {
      await expect(page).toHaveURL(/\/account/, { timeout: 15000 });
    } else {
      await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 15000 });
    }
  });
}