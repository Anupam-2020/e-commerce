import { User } from "../models/User"

export const signup = (data: any) => {
    return User.create(data);
}

export const findUserByEmail = async (email: string) => {
    const user = await User.findOne({ email }).select('+password');
    return user;
}