import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, TextField,
    List, ListItem, ListItemText, IconButton, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CategoryManagerDialog = ({ open, onClose, categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
    const { t } = useTranslation();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [addError, setAddError] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [editError, setEditError] = useState('');

    const handleAdd = () => {
        if (!newCategoryName.trim()) {
            setAddError('Category name cannot be empty.');
            return;
        }
        onAddCategory(newCategoryName);
        setNewCategoryName('');
        setAddError('');
    };

    const handleStartEdit = (category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
        setEditError('');
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
        setEditError('');
    };

    const handleSaveEdit = () => {
        if (!editingCategoryName.trim()) {
            setEditError('Name cannot be empty.');
            return;
        }
        onUpdateCategory(editingCategoryId, editingCategoryName);
        handleCancelEdit();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{t('dialogs.manageCategoriesTitle')}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 1, my: 2, alignItems: 'flex-start' }}>
                    <TextField
                        label={t('dialogs.newCategoryName')}
                        value={newCategoryName}
                        onChange={(e) => {
                            setNewCategoryName(e.target.value);
                            if (addError) setAddError('');
                        }}
                        size="small"
                        fullWidth
                        autoFocus
                        error={!!addError}
                        helperText={addError}
                    />
                    <Button onClick={handleAdd} variant="contained">{t('buttons.add')}</Button>
                </Box>
                <Typography variant="subtitle1">{t('dialogs.existingCategories')}</Typography>
                <List dense>
                    {categories.map(cat => (
                        <ListItem key={cat.id}>
                            {editingCategoryId === cat.id ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                    <TextField
                                        value={editingCategoryName}
                                        onChange={(e) => {
                                            setEditingCategoryName(e.target.value);
                                            if (editError) setEditError('');
                                        }}
                                        size="small"
                                        fullWidth
                                        error={!!editError}
                                        helperText={editError}
                                    />
                                    <IconButton aria-label="save" onClick={handleSaveEdit}><SaveIcon /></IconButton>
                                    <IconButton aria-label="cancel" onClick={handleCancelEdit}><CancelIcon /></IconButton>
                                </Box>
                            ) : (
                                <>
                                    <ListItemText primary={cat.name} />
                                    <IconButton aria-label="edit" edge="end" sx={{ mr: 1 }} onClick={() => handleStartEdit(cat)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton aria-label="delete" edge="end" onClick={() => onDeleteCategory(cat.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('buttons.close')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryManagerDialog;