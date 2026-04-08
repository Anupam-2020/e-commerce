import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';


export const signup = async(email: string, password: string) => {
    const existingUser = await User.findOne({ email }).select("+password");
    if(existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    return {
        user: {
            id: user._id,
            email: user.email,
        },
        token: generateToken(user._id.toString())
    };
};


export const login = async(email: string, password: string)  => {
    const user = await User.findOne({ email }).select("+password");
    if(!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid credentials');


    return {
        user: {
            id: user._id,
            email: user.email
        },
        token: generateToken(user._id.toString())
    }
}