import { Router } from 'express';
import { suggestItemName } from '../controllers/aiController.js';

const router = Router();

router.post('/suggest-name', suggestItemName);

export default router;