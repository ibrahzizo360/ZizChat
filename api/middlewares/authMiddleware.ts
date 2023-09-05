import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/userModel';

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can use a specific type here if available
    }
  }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Decodes token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            req.user = await UserModel.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

