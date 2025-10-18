import { useState, useEffect, useCallback } from 'react';
import axios, { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories.");
        }
    }, []);

    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (name: string) => {
        try {
            await axios.post(`${API_BASE_URL}/api/categories`, { name });
            toast.success("Category added!");
            await fetchCategories();
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || "Failed to add category.");
            } else {
                toast.error("Failed to add category.");
            }
        }
    };

    const updateCategory = async (id: string, name: string) => {
        try {
            await axios.put(`${API_BASE_URL}/api/categories/${id}`, { name });
            toast.success("Category updated!");
            await fetchCategories();
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || "Failed to update category.");
            } else {
                toast.error("Failed to update category.");
            }
        }
    };

    const deleteCategory = async (id: string) => {
        if (window.confirm("Deleting a category will un-categorize associated items. Continue?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
                toast.success("Category deleted!");
                await fetchCategories();
            } catch (error) {
                toast.error("Failed to delete category.");
            }
        }
    };

    return { categories, addCategory, updateCategory, deleteCategory, fetchCategories };
}