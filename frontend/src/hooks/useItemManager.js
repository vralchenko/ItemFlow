import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useItemManager() {
    // All state is managed inside the hook
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filter, setFilter] = useState('');
    const [formData, setFormData] = useState({ name: '', category_id: '' });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    // All data fetching and logic functions are also here
    const fetchItems = useCallback(async () => {
        try {
            const params = { page, filter, limit: 5 };
            const response = await axios.get(`${API_BASE_URL}/api/items`, { params });
            setItems(response.data.items);
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalItems);
        } catch (error) {
            toast.error("Failed to fetch items.");
        }
    }, [page, filter]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories.");
        }
    }, []);

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, [fetchItems, fetchCategories]);

    const handleAddCategory = async (name) => {
        try {
            await axios.post(`${API_BASE_URL}/api/categories`, { name });
            toast.success("Category added!");
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add category.");
        }
    };

    const handleUpdateCategory = async (id, name) => {
        try {
            await axios.put(`${API_BASE_URL}/api/categories/${id}`, { name });
            toast.success("Category updated!");
            fetchCategories();
            fetchItems();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update category.");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Deleting a category will un-categorize associated items. Continue?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
                toast.success("Category deleted!");
                fetchCategories();
                fetchItems();
            } catch (error) {
                toast.error("Failed to delete category.");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (value) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPage(1);
    };

    const validateItemForm = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Item name is required.";
        if (!formData.category_id) tempErrors.category_id = "Category is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleOpenAddDialog = () => {
        handleCancelEdit();
        setItemDialogOpen(true);
    };

    const handleEdit = (item) => {
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
        setPreview(null);
        setItemDialogOpen(false);
    };

    const handleSubmit = async (e) => {
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
            fetchItems();
        } catch (error) {
            toast.error("An error occurred while saving the item.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/items/${id}`);
                toast.success("Item deleted successfully!");
                fetchItems();
            } catch (error) {
                toast.error("Failed to delete item.");
            }
        }
    };

    const handlePageChange = (event, value) => {
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
            const response = await axios.post(`${API_BASE_URL}/api/ai/suggest-name`, {
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

    // The hook returns everything the UI component needs
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