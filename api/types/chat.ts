import mongoose, { Document, Schema ,Model, Types} from 'mongoose';



export interface IChat {
    chatName: String,
    isGroupChat: Boolean,
    users: Types.ObjectId[],
    latestMessage: Types.ObjectId,
    groupAdmin: Types.ObjectId
  }




export interface IChatSchema extends IChat, Document{
    _id: Types.ObjectId,
    createdAt: Date;   
    updatedAt: Date;  
  };  



  
export interface IChatModel extends Model<IChatSchema> {} 