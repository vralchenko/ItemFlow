import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import axios, { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Item, Category } from '../types';
import { SelectChangeEvent } from '@mui/material'; // This import is added

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface FormData {
    name: string;
    category_id: string;
}

interface FormErrors {
    name?: string;
    category_id?: string;
}

export function useItemManager() {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [filter, setFilter] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({ name: '', category_id: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [itemDialogOpen, setItemDialogOpen] = useState<boolean>(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

    const fetchItems = useCallback(async () => {
        try {
            const params = { page, filter, limit: 5 };
            const response = await axios.get<{
                items: Item[];
                totalPages: number;
                totalItems: number;
            }>(`${API_BASE_URL}/api/items`, { params });
            setItems(response.data.items);
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalItems);
        } catch (error) {
            toast.error("Failed to fetch items.");
        }
    }, [page, filter]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories.");
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchItems();
            await fetchCategories();
        };
        void loadData();
    }, [fetchItems, fetchCategories]);

    const handleAddCategory = async (name: string) => {
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

    const handleUpdateCategory = async (id: string, name: string) => {
        try {
            await axios.put(`${API_BASE_URL}/api/categories/${id}`, { name });
            toast.success("Category updated!");
            await fetchCategories();
            await fetchItems();
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || "Failed to update category.");
            } else {
                toast.error("Failed to update category.");
            }
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm("Deleting a category will un-categorize associated items. Continue?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
                toast.success("Category deleted!");
                await fetchCategories();
                await fetchItems();
            } catch (error) {
                toast.error("Failed to delete category.");
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (value) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setPage(1);
    };

    const validateItemForm = (): boolean => {
        const tempErrors: FormErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Item name is required.";
        if (!formData.category_id) tempErrors.category_id = "Category is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleOpenAddDialog = () => {
        handleCancelEdit();
        setItemDialogOpen(true);
    };

    const handleEdit = (item: Item) => {
        setEditingId(item.id);
        const categoryObj = categories.find(c => c.name === item.category);
        setFormData({ name: item.name, category_id: categoryObj ? categoryObj.id : '' });
        setErrors({});
        setPreview(item.image ? `${API_BASE_URL}/uploads/${item.image}` : null);
        setItemDialogOpen(true);
    };

    const handleCancelEdit = () => {
        setFormData({ name: '', category_id: '' });
        setEditingId(null);
        setErrors({});
        setSelectedFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setItemDialogOpen(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateItemForm()) return;

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/items/${editingId}`, data);
                toast.success("Item updated successfully!");
            } else {
                await axios.post(`${API_BASE_URL}/api/items`, data);
                toast.success("Item added successfully!");
            }
            handleCancelEdit();
            await fetchItems();
        } catch (error) {
            toast.error("An error occurred while saving the item.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/items/${id}`);
                toast.success("Item deleted successfully!");
                await fetchItems();
            } catch (error) {
                toast.error("Failed to delete item.");
            }
        }
    };

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSuggestName = async () => {
        const category = categories.find(c => c.id === formData.category_id);
        if (!category) {
            toast.warn("Please select a category first.");
            return;
        }

        setIsSuggesting(true);
        try {
            const response = await axios.post<string[]>(`${API_BASE_URL}/api/ai/suggest-name`, {
                categoryName: category.name
            });
            const suggestions = response.data;
            if (suggestions && suggestions.length > 0) {
                setFormData(prev => ({ ...prev, name: suggestions[0] }));
            }
        } catch (error) {
            toast.error("Could not get a suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    };

    return {
        items,
        categories,
        page,
        totalPages,
        totalItems,
        filter,
        setFilter,
        formData,
        editingId,
        errors,
        itemDialogOpen,
        setItemDialogOpen,
        categoryDialogOpen,
        setCategoryDialogOpen,
        preview,
        isSuggesting,
        handleOpenAddDialog,
        handleEdit,
        handleCancelEdit,
        handleSubmit,
        handleDelete,
        handlePageChange,
        handleInputChange,
        handleFileChange,
        handleFilterChange,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleSuggestName,
    };
}