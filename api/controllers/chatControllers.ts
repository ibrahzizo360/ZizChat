import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import ChatModel from '../models/chatModel'; 
import UserModel from '../models/userModel'; 

interface IChatRegistrationRequest extends Request {
    body: {
        userId: string;
    };
}

export const accessChat = asyncHandler(async (req: IChatRegistrationRequest, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    if (!userId) {
        throw new Error("Enter user ID")
    }

    const isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate('users', '-password')
        .populate('latestMessage');

    await UserModel.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email',
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        const chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await ChatModel.create(chatData);
            const FullChat = await ChatModel.findOne({ _id: createdChat._id }).populate('users', '-password');
            res.status(200).send(FullChat);
        } catch (error) {
            next(error); 
        }
    }
});

export const fetchChats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const chats = await ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })

    await UserModel.populate(chats, {
        path: 'latestMessage.sender',
        select: 'name pic email',
    });

    res.status(200).send(chats);
    } catch (error) {
        next(error);
    }
    
})