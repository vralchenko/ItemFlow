const { test, expect } = require('@playwright/test');

test.skip('AI API', () => {

    test('should return a list of suggestions for a valid category', async ({ request }) => {
        const response = await request.post('/api/ai/suggest-name', {
            data: {
                categoryName: 'Electronics'
            }
        });

        // Assert that the request was successful
        expect(response.ok()).toBeTruthy();

        // Assert that the response body is an array with suggestions
        const suggestions = await response.json();
        expect(Array.isArray(suggestions)).toBeTruthy();
        expect(suggestions.length).toBeGreaterThan(0);
        // Check that the suggestions are strings
        expect(typeof suggestions[0]).toBe('string');
    });

    test('should return 400 if categoryName is missing', async ({ request }) => {
        const response = await request.post('/api/ai/suggest-name', {
            data: {} // Send an empty body
        });

        // Assert that the server correctly identifies the bad request
        expect(response.status()).toBe(400);

        const error = await response.json();
        expect(error.error).toBe('Category name is required.');
    });
});