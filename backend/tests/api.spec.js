const { test, expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

test.beforeEach(async ({ request }) => {
    const response = await request.post('/api/test/reset');
    expect(response.ok()).toBeTruthy();
});

test.describe('Categories API', () => {
    test('should create a new category', async ({ request }) => {
        const response = await request.post('/api/categories', {
            data: { name: 'Electronics' }
        });
        expect(response.status()).toBe(201);
        const newCategory = await response.json();
        expect(newCategory.name).toBe('Electronics');
        expect(newCategory).toHaveProperty('id');
    });

    test('should update a category name', async ({ request }) => {
        // 1. Create a category to update
        const createRes = await request.post('/api/categories', { data: { name: 'Old Name' } });
        const category = await createRes.json();

        // 2. Send the PUT request to update it
        const updateRes = await request.put(`/api/categories/${category.id}`, {
            data: { name: 'New Updated Name' }
        });
        expect(updateRes.ok()).toBeTruthy();

        // 3. Verify the response contains the new name
        const updatedCategory = await updateRes.json();
        expect(updatedCategory.name).toBe('New Updated Name');
    });

    test('should retrieve all categories', async ({ request }) => {
        await request.post('/api/categories', { data: { name: 'Books' } });
        await request.post('/api/categories', { data: { name: 'Groceries' } });

        const response = await request.get('/api/categories');
        expect(response.ok()).toBeTruthy();
        const categories = await response.json();

        expect(categories).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'Books' }),
            expect.objectContaining({ name: 'Groceries' }),
        ]));
    });

    test('should return 409 Conflict for duplicate category names', async ({ request }) => {
        await request.post('/api/categories', { data: { name: 'Unique Category' } });

        const response = await request.post('/api/categories', {
            data: { name: 'Unique Category' }
        });
        expect(response.status()).toBe(409);
    });
});


test.describe('Items API', () => {
    let testCategoryId;

    test.beforeEach(async ({ request }) => {
        const response = await request.post('/api/categories', {
            data: { name: 'Test Category' }
        });
        const category = await response.json();
        testCategoryId = category.id;
    });

    test('should create a new item with an image', async ({ request }) => {
        const imagePath = path.resolve(__dirname, 'test-image.png');
        fs.writeFileSync(imagePath, 'fake image content');

        const response = await request.post('/api/items', {
            multipart: {
                name: 'Test Item with Image',
                category_id: testCategoryId,
                image: {
                    name: 'test-image.png',
                    mimeType: 'image/png',
                    buffer: fs.readFileSync(imagePath),
                },
            }
        });

        expect(response.status()).toBe(201);
        const newItem = await response.json();
        expect(newItem.name).toBe('Test Item with Image');
        expect(newItem.category).toBe('Test Category');
        expect(newItem.image).toContain('image-');
    });

    test('should retrieve a list of items', async ({ request }) => {
        await request.post('/api/items', {
            data: { name: 'My Book', category_id: testCategoryId }
        });

        const response = await request.get('/api/items');
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.items).toHaveLength(1);
        expect(body.items[0].name).toBe('My Book');
    });

    test('should update an existing item', async ({ request }) => {
        const createRes = await request.post('/api/items', {
            data: { name: 'Old Name', category_id: testCategoryId }
        });
        const item = await createRes.json();

        const updateResponse = await request.put(`/api/items/${item.id}`, {
            data: {
                name: 'New Updated Name',
                category_id: testCategoryId
            }
        });

        expect(updateResponse.ok()).toBeTruthy();
        const updatedItem = await updateResponse.json();
        expect(updatedItem.name).toBe('New Updated Name');
    });

    test('should delete an item', async ({ request }) => {
        const createRes = await request.post('/api/items', {
            data: { name: 'Item to Delete', category_id: testCategoryId }
        });
        const item = await createRes.json();

        const deleteResponse = await request.delete(`/api/items/${item.id}`);
        expect(deleteResponse.status()).toBe(204);

        const getResponse = await request.get('/api/items');
        const body = await getResponse.json();
        expect(body.items).toHaveLength(0);
    });

    test('should return 404 for a non-existent item on update', async ({ request }) => {
        const nonExistentId = '123-abc-fake-id';
        const response = await request.put(`/api/items/${nonExistentId}`, {
            data: {
                name: 'Trying to update',
                category_id: testCategoryId
            }
        });
        expect(response.status()).toBe(404);
    });
});