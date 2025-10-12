import React from 'react';
import ItemList from './components/ItemList';
import ItemFormDialog from './components/ItemFormDialog';
import CategoryManagerDialog from './components/CategoryManagerDialog';
import { useItemManager } from './hooks/useItemManager'; // Import the custom hook

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Container, TextField, Button, Typography, Paper, Box, Stack, Pagination,
    InputAdornment, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CategoryIcon from '@mui/icons-material/Category';

function App() {
    // Call the hook to get all state and logic
    const {
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
        categoryDialogOpen,
        setCategoryDialogOpen,
        preview,
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
    } = useItemManager();

    // The component is now only responsible for rendering the UI
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Container maxWidth="md">
                <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1">
                            Item Flow
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" startIcon={<CategoryIcon />} onClick={() => setCategoryDialogOpen(true)}>
                                Manage Categories
                            </Button>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
                                Add New Item
                            </Button>
                        </Stack>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Total items found: {totalItems}
                    </Typography>

                    <TextField
                        label="Filter by name..."
                        fullWidth
                        value={filter}
                        onChange={handleFilterChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {filter && (
                                        <IconButton onClick={() => setFilter('')} edge="end">
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />

                    <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />

                    <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Stack>
                </Paper>
            </Container>

            <ItemFormDialog
                open={itemDialogOpen}
                onClose={handleCancelEdit}
                onSubmit={handleSubmit}
                formData={formData}
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                editingId={editingId}
                errors={errors}
                preview={preview}
                categories={categories}
            />
            <CategoryManagerDialog
                open={categoryDialogOpen}
                onClose={() => setCategoryDialogOpen(false)}
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        </>
    );
}

export default App;