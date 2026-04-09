import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import * as userRepo from '../repositories/authRepository';



export const signup = async(email: string, password: string) => {
    const existingUser = await userRepo.findUserByEmail(email);

    if(existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepo.signup({
        email,
        password: hashedPassword
    });

    return {
        user: {
            id: user._id,
            email: user.email,
        },
        token: generateToken(user._id.toString(), user.role)
    };
};


export const login = async(email: string, password: string)  => {
    const user = await userRepo.findUserByEmail(email);

    if(!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid credentials');

    console.log(user);

    return {
        user: {
            id: user._id,
            email: user.email
        },
        token: generateToken(user._id.toString(), user.role)
    }
}