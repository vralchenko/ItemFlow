import React from 'react';
import {
    List, ListItem, ListItemText, IconButton,
    Avatar, ListItemAvatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { Item } from '../types';

interface ItemListProps {
    items: Item[];
    onEdit: (item: Item) => void;
    onDelete: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete }) => {
    const getImageUrl = (imagePath: string | null): string | undefined => {
        if (!imagePath) {
            return undefined;
        }
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `${import.meta.env.VITE_API_URL}/uploads/${imagePath}`;
    };

    return (
        <List>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    secondaryAction={
                        <>
                            <IconButton aria-label="edit" edge="end" onClick={() => onEdit(item)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" edge="end" onClick={() => onDelete(item.id)} sx={{ ml: 1 }}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar src={getImageUrl(item.image)}>
                            {!item.image && <ImageIcon />}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.name} secondary={item.category || 'Uncategorized'}
                        sx={{ wordBreak: 'break-word' }}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default ItemList;