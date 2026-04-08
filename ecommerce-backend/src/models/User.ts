import mongoose, { Document, Schema }  from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'user' | 'admin';
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            default: 'user'
        },
    }, { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);