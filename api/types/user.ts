import mongoose, { Document, Schema ,Model, Types} from 'mongoose';



export interface IUser {
   name: string,
   email: string,
   password: string,
   pic: string
  }




export interface IUserSchema extends IUser, Document{
    _id: Types.ObjectId;
    matchPassword(password: string): Promise<boolean>;
    createdAt: Date;   
    updatedAt: Date;  
  };  



  
export interface IUserModel extends Model<IUserSchema> {} 