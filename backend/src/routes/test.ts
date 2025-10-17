import { Router } from 'express';
import { resetDatabase } from '../controllers/testController.js';

const router = Router();

router.post('/reset', resetDatabase);

export default router;