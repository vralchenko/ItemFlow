import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Box, Stack, TextField, MenuItem // Added MenuItem for category dropdown
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'; // Changed to SaveIcon for consistency
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
                            categories // Added categories prop for the dropdown
                        }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <Box component="form" onSubmit={onSubmit}>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Item Name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            autoFocus
                        />
                        {/* Changed category to a Select/Dropdown */}
                        <TextField
                            select // Make it a select input
                            label="Category"
                            name="category_id" // Changed name to category_id
                            value={formData.category_id || ''} // Handle null/undefined for initial value
                            onChange={onInputChange}
                            fullWidth
                            required
                            error={!!errors.category_id} // Use category_id for errors
                            helperText={errors.category_id}
                        >
                            {/* Option for no category */}
                            <MenuItem value="">
                                <em>No Category</em>
                            </MenuItem>
                            {/* Map over categories to create options */}
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Upload Image
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
                    {/* Changed order here: Save first, then Cancel */}
                    <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                        {editingId ? 'Save' : 'Add'}
                    </Button>
                    <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ItemFormDialog;