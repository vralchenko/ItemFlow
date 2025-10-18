import { test, expect, APIResponse } from '@playwright/test';

test.describe('AI API Endpoint', () => {

    test.skip('should return a list of suggestions for a valid category', async ({ request }) => {
        // Make the API request to the backend endpoint
        const response: APIResponse = await request.post('/api/ai/suggest-name', {
            data: {
                categoryName: 'Electronics'
            }
        });

        // Assert that the request was successful (status 2xx)
        expect(response.ok()).toBeTruthy();

        // Assert that the response body is an array of suggestions
        const suggestions: string[] = await response.json();
        expect(Array.isArray(suggestions)).toBeTruthy();
        expect(suggestions.length).toBeGreaterThan(0);

        // Check that at least the first suggestion is a non-empty string
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

        // Assert that the request failed with a 400 Bad Request status
        expect(response.status()).toBe(400);

        const error = await response.json();
        expect(error.error).toBe('Category name is required.');
    });
});