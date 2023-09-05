import mongoose, { Schema } from 'mongoose';
import { IChat, IChatModel, IChatSchema } from '../types/chat';

const ChatSchema = new Schema<IChat>(
    {
        chatName: {type: String, trim: true},
        isGroupChat: {type:Boolean,default: false},
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        latestMessage : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { 
        timestamps: true,
    }
);

const ChatModel = mongoose.model<IChatSchema, IChatModel>('Chat', ChatSchema);

export default ChatModel;

