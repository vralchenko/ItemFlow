import React from 'react';
import { useTranslation } from 'react-i18next';
import ItemList from './components/ItemList';
import ItemFormDialog from './components/ItemFormDialog';
import CategoryManagerDialog from './components/CategoryManagerDialog';
import { useItemManager } from './hooks/useItemManager';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Container, TextField, Button, Typography, Paper, Box, Stack, Pagination,
    InputAdornment, IconButton, ButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CategoryIcon from '@mui/icons-material/Category';

function App() {
    const { t, i18n } = useTranslation();
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

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Container maxWidth="md">
                <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h4" component="h1">
                            {t('headerTitle')}
                        </Typography>
                        <ButtonGroup size="small" aria-label="language selector">
                            <Button onClick={() => changeLanguage('en')} variant={i18n.resolvedLanguage === 'en' ? 'contained' : 'outlined'}>EN</Button>
                            <Button onClick={() => changeLanguage('de')} variant={i18n.resolvedLanguage === 'de' ? 'contained' : 'outlined'}>DE</Button>
                            <Button onClick={() => changeLanguage('ru')} variant={i18n.resolvedLanguage === 'ru' ? 'contained' : 'outlined'}>RU</Button>
                            <Button onClick={() => changeLanguage('uk')} variant={i18n.resolvedLanguage === 'uk' ? 'contained' : 'outlined'}>UK</Button>
                        </ButtonGroup>
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {t('totalItemsFound', { count: totalItems })}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" startIcon={<CategoryIcon />} onClick={() => setCategoryDialogOpen(true)}>
                                {t('manageCategories')}
                            </Button>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
                                {t('addNewItem')}
                            </Button>
                        </Stack>
                    </Box>

                    <TextField
                        label={t('filterPlaceholder')}
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