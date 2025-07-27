import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

export async function registerUser(email, password) {
  if (await findUserByEmail(email)) {
    throw new Error('Email already in use');
  }
  const hash = await bcrypt.hash(password, 10);
  const userId = await createUser(email, hash);
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('Invalid credentials');
  }
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
