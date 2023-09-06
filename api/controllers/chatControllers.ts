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

export const createGroupChat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   
    if(!req.body.users || !req.body.name) {
        res.status(400).send({message: "Please fill all fields"})
        return; 
    }

    var users = req.body.users

    if(users.length < 2){
        res.status(400).send({message: "more than 2 users required"})
        return;
    }

    users.push(req.user)

    try{
        const groupChat = await ChatModel.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })
        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        res.status(200).send(fullGroupChat);

    } catch (error) {
        next(error)
    }
})


export const renameGroup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {chatId, chatName} = req.body;

    const updatedChat = await ChatModel.findByIdAndUpdate(
        chatId, {
            chatName
        },{
            new: true
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if(!updatedChat) {
        res.status(404)
        throw new Error("Chat not found")
    } else {
        res.status(200).send(updatedChat)
    }
});

export const addToGroup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {chatId, userId} = req.body;

    const added = await ChatModel.findByIdAndUpdate(chatId,{
        $push: {users: userId}
    },
    {new: true}
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(!added) {
        res.status(404)
        throw new Error("Chat not found")
    } else {
        res.status(200).send(added)
    }
});

export const removeFromGroup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {chatId, userId} = req.body;

    const removed = await ChatModel.findByIdAndUpdate(chatId,{
        $pull: {users: userId}
    },
    {new: true}
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(!removed) {
        res.status(404)
        throw new Error("Chat not found")
    } else {
        res.status(200).send(removed)
    }
});


