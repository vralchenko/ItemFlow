import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Box, Stack, TextField, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

const ItemFormDialog = ({
                            open,
                            onClose,
                            onSubmit,
                            formData,
                            onInputChange,
                            onFileChange,
                            editingId,
                            errors,
                            preview,
                            categories
                        }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingId ? t('dialogs.editItemTitle') : t('dialogs.addItemTitle')}</DialogTitle>
            <Box component="form" onSubmit={onSubmit}>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label={t('form.itemName')}
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            autoFocus
                        />
                        <FormControl fullWidth required error={!!errors.category_id}>
                            <InputLabel id="category-select-label">{t('form.category')}</InputLabel>
                            <Select
                                labelId="category-select-label"
                                name="category_id"
                                value={formData.category_id || ''}
                                label={t('form.category')}
                                onChange={onInputChange}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            {t('form.uploadImage')}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={onFileChange}
                            />
                        </Button>
                        {preview && (
                            <Box sx={{ textAlign: 'center' }}>
                                <img src={preview} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', marginTop: '10px' }} />
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} startIcon={<CancelIcon />}>{t('buttons.cancel')}</Button>
                    <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                        {editingId ? t('buttons.save') : t('buttons.add')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ItemFormDialog;