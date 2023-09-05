import { Schema, model, SchemaTypes, CallbackError, Model } from "mongoose";
import { IUserModel, IUserSchema } from "../types/user";
import bcrypt from 'bcrypt'

const UserSchema = new Schema<IUserSchema>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre<IUserSchema>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error as CallbackError);
    }
});



const UserModel = model<IUserSchema, IUserModel>('User', UserSchema);

export default UserModel;

