import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

export async function registerUser(email, password) {
  if (await findUserByEmail(email)) {
    throw new Error('Email already in use');
  }
  const hash   = await bcrypt.hash(password, 10);
  const userId = await createUser(email, hash, 'examiner'); // set default role
  return jwt.sign(
    { userId, role: 'examiner' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  console.log('Login password:', password);
  console.log('Stored hash:', user.password_hash);
  const match = await bcrypt.compare(password, user.password_hash);
  console.log('Bcrypt match:', match);
  if (!match) {
    throw new Error('Invalid credentials');
  }
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

