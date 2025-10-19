import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Item } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filter, setFilter] = useState<string>('');

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { page, filter, limit: 5 };
            const response = await axios.get<{
                items: Item[];
                totalPages: number;
                totalItems: number;
            }>(`${API_BASE_URL}/api/items`, { params });
            setItems(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(message);
            toast.error("Failed to fetch items.");
        } finally {
            setIsLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchItems();
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [fetchItems]);

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setPage(1);
    };

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const deleteItem = async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/items/${id}`);
            toast.success("Item deleted successfully!");
            await fetchItems();
        } catch (error) {
            toast.error("Failed to delete item.");
        }
    };

    return {
        items,
        isLoading,
        error,
        page,
        totalPages,
        filter,
        handleFilterChange,
        handlePageChange,
        deleteItem,
        fetchItems
    };
}