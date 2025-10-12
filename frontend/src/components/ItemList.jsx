import React from 'react';
import {
    List, ListItem, ListItemText, IconButton,
    Avatar, ListItemAvatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

const UPLOADS_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;

const ItemList = ({ items, onEdit, onDelete }) => {
    return (
        <List>
            {items.map(item => (
                <ListItem
                    key={item.id}
                    secondaryAction={
                        <>
                            {/* ARIA-LABEL ADDED HERE */}
                            <IconButton aria-label="edit" edge="end" onClick={() => onEdit(item)}>
                                <EditIcon />
                            </IconButton>
                            {/* ARIA-LABEL ADDED HERE */}
                            <IconButton aria-label="delete" edge="end" onClick={() => onDelete(item.id)} sx={{ ml: 1 }}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar src={item.image ? `${UPLOADS_URL}${item.image}` : undefined}>
                            {!item.image && <ImageIcon />}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${item.name} (${item.category})`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default ItemList;