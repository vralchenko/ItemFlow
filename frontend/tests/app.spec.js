import { test, expect } from '@playwright/test';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

test.beforeEach(async () => {
    await axios.post(`${API_BASE_URL}/api/test/reset`);
});

test('Full user flow: Create, Edit, and use a Category, then Create and Delete an Item', async ({ page }) => {
    // --- PART 1: Go to the app ---
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Item Flow' })).toBeVisible();

    // --- PART 2: Create a Category ---
    await page.getByRole('button', { name: 'Manage Categories' }).click();
    await expect(page.getByRole('heading', { name: 'Manage Categories' })).toBeVisible();

    await page.getByLabel('New Category Name').fill('Fruits');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Fruits')).toBeVisible();

    // --- PART 3: Edit the Category ---
    const categoryRow = page.locator('li', { hasText: 'Fruits' });
    await categoryRow.getByRole('button', { name: 'edit' }).click();

    const editTextbox = page.locator('input[value="Fruits"]');
    await expect(editTextbox).toBeVisible();

    await editTextbox.fill('Tropical Fruits');
    await page.getByRole('button', { name: 'save' }).click();

    // ✅ CORRECTION: Use { exact: true } to prevent partial matches.
    await expect(page.getByText('Tropical Fruits', { exact: true })).toBeVisible();
    await expect(page.getByText('Fruits', { exact: true })).not.toBeVisible();

    // Close the category manager
    await page.getByRole('button', { name: 'Close' }).click();

    // --- PART 4: Create an Item using the edited Category ---
    await page.getByRole('button', { name: 'Add New Item' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Item' })).toBeVisible();

    // Fill out the form
    await page.getByLabel('Item Name').fill('Mango');
    await page.getByLabel('Category').click(); // Click to open the dropdown
    await page.getByRole('option', { name: 'Tropical Fruits' }).click(); // Select the EDITED category
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // --- PART 5: Verify the Item was created ---
    await expect(page.getByText('Mango (Tropical Fruits)')).toBeVisible();

    // --- PART 6: Delete the Item ---
    const itemRow = page.locator('li', { hasText: 'Mango (Tropical Fruits)' });

    // Accept the browser's confirmation dialog BEFORE clicking delete
    page.on('dialog', dialog => dialog.accept());

    await itemRow.getByRole('button', { name: 'delete' }).click();

    // Verify the item is no longer visible
    await expect(page.getByText('Mango (Tropical Fruits)')).not.toBeVisible();
});