import express from 'express';
import {protect} from '../middlewares/authMiddleware'
import { allMessages, sendMessage } from '../controllers/messageControllers';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, allMessages);

export default router;
