import mongoose, { Schema } from 'mongoose';
import { IMessage, IMessageModel, IMessageSchema } from '../types/message';



const MessageSchema = new Schema<IMessage>({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: {type: String, trim: true},
    chat: {type: mongoose.Schema.Types.ObjectId, ref:'Chat'}
},
{
    timestamps : true,
});


const MessageModel = mongoose.model<IMessageSchema, IMessageModel>('Message', MessageSchema);

export default MessageModel;

