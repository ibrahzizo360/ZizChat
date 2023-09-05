import express from 'express';
import { Request, Response } from 'express';
import { registerUser, authUser, allUsers } from '../controllers/userControllers';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .post(registerUser)
    .get(protect, allUsers);

router.post('/login', authUser);

export default router;
