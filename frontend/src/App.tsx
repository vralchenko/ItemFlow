import React, { useState, useCallback, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useItems } from './hooks/useItems';
import { useCategories } from './hooks/useCategories';
import ItemList from './components/ItemList';
import ItemFormDialog from './components/ItemFormDialog';
import CategoryManagerDialog from './components/CategoryManagerDialog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container, TextField, Paper, Box, Stack, Pagination,
    InputAdornment, IconButton, ButtonGroup, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CategoryIcon from '@mui/icons-material/Category';
import { Item } from './types';

function App() {
    const { t, i18n } = useTranslation();
    const {
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
    } = useItems();
    const {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    const [isItemDialogOpen, setItemDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    const handleOpenEditDialog = useCallback((item: Item) => {
        setEditingItem(item);
        setItemDialogOpen(true);
    }, []);

    const handleOpenAddDialog = () => {
        setEditingItem(null);
        setItemDialogOpen(true);
    };

    const handleItemDialogClose = () => {
        setItemDialogOpen(false);
    };

    const handleItemSave = async () => {
        setItemDialogOpen(false);
        await fetchItems();
    };

    const handleCategoryDialogClose = async () => {
        setCategoryDialogOpen(false);
        await fetchItems();
    };

    const changeLanguage = async (lng: string) => {
        await i18n.changeLanguage(lng);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <h1>{t('appTitle')}</h1>
                    <ButtonGroup variant="outlined" aria-label="language selection" size="small">
                        <Button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>EN</Button>
                        <Button onClick={() => changeLanguage('de')} disabled={i18n.language === 'de'}>DE</Button>
                        <Button onClick={() => changeLanguage('ru')} disabled={i18n.language === 'ru'}>RU</Button>
                        <Button onClick={() => changeLanguage('uk')} disabled={i18n.language === 'uk'}>UK</Button>
                    </ButtonGroup>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label={t('filterByName')}
                        variant="outlined"
                        value={filter}
                        onChange={handleFilterChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {filter && (
                                        <IconButton onClick={() => handleFilterChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)} edge="end">
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<CategoryIcon />}
                        onClick={() => setCategoryDialogOpen(true)}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {t('manageCategories')}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {t('addNewItem')}
                    </Button>
                </Stack>

                <ItemList
                    items={items}
                    onEdit={handleOpenEditDialog}
                    onDelete={deleteItem}
                />

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Paper>

            <ItemFormDialog
                open={isItemDialogOpen}
                onClose={handleItemDialogClose}
                onSave={handleItemSave}
                editingItem={editingItem}
                categories={categories}
            />

            <CategoryManagerDialog
                open={isCategoryDialogOpen}
                onClose={handleCategoryDialogClose}
                categories={categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
            />

            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        </Container>
    );
}

export default App;