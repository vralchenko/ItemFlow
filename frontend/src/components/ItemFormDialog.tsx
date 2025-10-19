import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Box, Stack, TextField, Select, MenuItem, InputLabel, FormControl,
    IconButton, InputAdornment, CircularProgress, SelectChangeEvent, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Category, Item } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface FormData {
    name: string;
    category_id: string;
}

interface FormErrors {
    name?: string;
    category_id?: string;
}

interface ItemFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    editingItem: Item | null;
    categories: Category[];
}

const ItemFormDialog: React.FC<ItemFormDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           onSave,
                                                           editingItem,
                                                           categories,
                                                       }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData>({ name: '', category_id: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (editingItem) {
            const categoryObj = categories.find(c => c.name === editingItem.category);
            setFormData({ name: editingItem.name, category_id: categoryObj ? categoryObj.id : '' });
            setPreview(editingItem.image);
        } else {
            setFormData({ name: '', category_id: '' });
            setPreview(null);
        }
        setErrors({});
        setSelectedFile(null);
        setSuggestions([]);
    }, [editingItem, categories, open]);

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

    const validateForm = (): boolean => {
        const tempErrors: FormErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Item name is required.";
        if (!formData.category_id) tempErrors.category_id = "Category is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            if (editingItem) {
                await axios.put(`${API_BASE_URL}/api/items/${editingItem.id}`, data);
                toast.success("Item updated successfully!");
            } else {
                await axios.post(`${API_BASE_URL}/api/items`, data);
                toast.success("Item added successfully!");
            }
            onSave();
        } catch (error) {
            toast.error("An error occurred while saving the item.");
        }
    };

    const handleSuggestName = async () => {
        const category = categories.find(c => c.id === formData.category_id);
        if (!category) {
            toast.warn("Please select a category first.");
            return;
        }

        setIsSuggesting(true);
        setSuggestions([]);
        try {
            const response = await axios.post<string[]>(`${API_BASE_URL}/api/ai/suggest-name`, {
                categoryName: category.name
            });
            if (response.data && response.data.length > 0) {
                setSuggestions(response.data);
            }
        } catch (error) {
            toast.error("Could not get a suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setFormData(prev => ({ ...prev, name: suggestion }));
        setSuggestions([]);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingItem ? t('dialogs.editItemTitle') : t('dialogs.addItemTitle')}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label={t('form.itemName')}
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            autoFocus
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="suggest name"
                                            onClick={handleSuggestName}
                                            disabled={isSuggesting || !formData.category_id}
                                        >
                                            {isSuggesting ? <CircularProgress size={24} /> : <AutoAwesomeIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {suggestions.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {suggestions.map((name, index) => (
                                    <Chip
                                        key={index}
                                        label={name}
                                        onClick={() => handleSuggestionClick(name)}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        )}
                        <FormControl fullWidth required error={!!errors.category_id}>
                            <InputLabel id="category-select-label">{t('form.category')}</InputLabel>
                            <Select
                                labelId="category-select-label"
                                name="category_id"
                                value={formData.category_id || ''}
                                label={t('form.category')}
                                onChange={handleInputChange}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" component="label">
                            {t('form.uploadImage')}
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                        {preview && (
                            <Box sx={{ textAlign: 'center' }}>
                                <img src={preview} alt={formData.name || 'Image preview'} style={{ maxHeight: '150px', maxWidth: '100%', marginTop: '10px' }} />
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} startIcon={<CancelIcon />}>{t('buttons.cancel')}</Button>
                    <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                        {editingItem ? t('buttons.save') : t('buttons.add')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ItemFormDialog;