import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ItemList from './components/ItemList';
import ItemFormDialog from './components/ItemFormDialog';
import CategoryManagerDialog from './components/CategoryManagerDialog';
import { useItemManager } from './hooks/useItemManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container, TextField, Paper, Box, Stack, Pagination,
    InputAdornment, IconButton, ButtonGroup, Button
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
        filter,
        handleFilterChange,
        formData,
        editingId,
        errors,
        itemDialogOpen,
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
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleSuggestName,
    } = useItemManager();

    const changeLanguage = async (lng: string) => {
        await i18n.changeLanguage(lng);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <h1>{t('appTitle')}</h1>
                    <ButtonGroup variant="outlined" aria-label="language selection">
                        <Button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>EN</Button>
                        <Button onClick={() => changeLanguage('de')} disabled={i18n.language === 'de'}>DE</Button>
                        <Button onClick={() => changeLanguage('ru')} disabled={i18n.language === 'ru'}>RU</Button>
                        <Button onClick={() => changeLanguage('uk')} disabled={i18n.language === 'uk'}>UK</Button>
                    </ButtonGroup>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
                open={itemDialogOpen}
                onClose={handleCancelEdit}
                onSubmit={handleSubmit}
                formData={formData}
                errors={errors}
                categories={categories}
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                preview={preview}
                onSuggestName={handleSuggestName}
                isSuggesting={isSuggesting}
                editingId={editingId}
            />

            <CategoryManagerDialog
                open={categoryDialogOpen}
                onClose={() => setCategoryDialogOpen(false)}
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
            />

            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        </Container>
    );
}

export default App;