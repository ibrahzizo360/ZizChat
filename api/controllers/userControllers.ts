import { Request, Response } from 'express';
import generateToken from '../config/generateToken';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/userModel';


interface IUserRegistrationRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        pic?: string;
    };
}

interface IUserAuthenticationRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export const registerUser = asyncHandler(async (req: IUserRegistrationRequest, res: Response) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please input all fields');
    }

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await UserModel.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400);
        throw new Error('Failed to create the user');
    }
});

export const authUser = asyncHandler(async (req: IUserAuthenticationRequest, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

export const allUsers = asyncHandler(async (req: Request, res: Response) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search.toString(), $options: 'i' } },
                  { email: { $regex: req.query.search.toString(), $options: 'i' } },
              ],
          }
        : {};
    const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

