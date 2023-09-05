import mongoose, { Document, Schema ,Model, Types} from 'mongoose';



export interface IMessage {
    sender: Types.ObjectId,
    content: String,
    chat: Types.ObjectId
  }




export interface IMessageSchema extends IMessage, Document{
    _id: Types.ObjectId,
    createdAt: Date;   
    updatedAt: Date;  
  };  



  
export interface IMessageModel extends Model<IMessageSchema> {} 