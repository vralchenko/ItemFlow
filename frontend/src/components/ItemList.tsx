import React from 'react';
import {
    List, ListItem, ListItemText, IconButton,
    Avatar, ListItemAvatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { Item } from '../types';

const UPLOADS_URL = `${import.meta.env.VITE_API_URL}/uploads/`;

interface ItemListProps {
    items: Item[];
    onEdit: (item: Item) => void;
    onDelete: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete }) => {
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
                        <Avatar src={item.image && item.image.length > 0 ? `${UPLOADS_URL}${item.image}` : undefined}>
                            {(!item.image || item.image.length === 0) && <ImageIcon />}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${item.name} (${item.category || 'Uncategorized'})`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default ItemList;