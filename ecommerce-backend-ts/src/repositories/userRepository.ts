import { User } from '../models/User';

export const findUserByEmail = (email: string, includePassword = false) => {
  const query = User.findOne({ email });
  return includePassword ? query.select('+password') : query;
};

export const createUser = (data: { email: string; password: string; role?: 'user' | 'admin' }) => {
  return User.create(data);
};
