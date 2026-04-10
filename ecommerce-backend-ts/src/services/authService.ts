import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/userRepository';
import { generateToken } from '../utils/jwt';

export const signup = async (email: string, password: string) => {
  const existingUser = await userRepo.findUserByEmail(email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({ email, password: hashedPassword });

  return {
    user: {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    token: generateToken(String(user._id), user.role)
  };
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findUserByEmail(email, true);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    user: {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    token: generateToken(String(user._id), user.role)
  };
};
