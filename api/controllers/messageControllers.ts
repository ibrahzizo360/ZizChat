import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import MessageModel from '../models/messageModel';
import UserModel from '../models/userModel';
import ChatModel from '../models/chatModel';

interface INewMessage {
    sender: string,
    content: string,
    chat: string
}



export const sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { content, chatId } = req.body;
    if(!content || !chatId) {
        res.status(400);
        throw new Error("Please input all fields")
    } 
    var newMessage : INewMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        var message = new MessageModel(newMessage);
        await message.save()

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        

        await UserModel.populate(message, {
        path: "chat.users",
        select: "name pic email",
        });

        await ChatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        next(error);
    }

});

export const allMessages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    try {
        const messages = await MessageModel.find({chat: chatId}).populate("sender", "name pic email").populate('chat');
        res.json(messages);
    } catch (error) {
        res.status(400);
        next(error);
    }
});
