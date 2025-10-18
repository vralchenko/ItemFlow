import { test, expect, APIResponse } from '@playwright/test';

test.describe('AI API Endpoint', () => {

    test.skip('should return a list of suggestions for a valid category', async ({ request }) => {
        const response: APIResponse = await request.post('/api/ai/suggest-name', {
            data: {
                categoryName: 'Electronics'
            }
        });

        expect(response.ok()).toBeTruthy();

        const suggestions: string[] = await response.json();
        expect(Array.isArray(suggestions)).toBeTruthy();
        expect(suggestions.length).toBeGreaterThan(0);

        if (suggestions.length > 0) {
            expect(typeof suggestions[0]).toBe('string');
        }
    });

    test('should return an error for a missing category name', async ({ request }) => {
        const response: APIResponse = await request.post('/api/ai/suggest-name', {
            data: {
                categoryName: ''
            }
        });

        expect(response.status()).toBe(400);

        const error = await response.json();
        expect(error.error).toBe('Category name is required.');
    });
});