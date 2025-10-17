import { Router, Request } from 'express';
import multer from 'multer';
import * as path from 'path';
import {
    getItems,
    createItem,
    updateItem,
    deleteItem
} from '../controllers/itemController.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getItems);
router.post('/', upload.single('image'), createItem);
router.put('/:id', upload.single('image'), updateItem);
router.delete('/:id', deleteItem);

export default router;