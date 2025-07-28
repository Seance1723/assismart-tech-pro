import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Optionally, you can include user role/status in token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: "2d" });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const exists = await findUserByEmail(email);
    if (exists) return res.status(400).json({ error: "Email already registered" });

    // Set default role; change if you want to allow more roles
    const role = "examiner";
    await createUser(email, password, role);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
}
