import { registerUser, loginUser } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const token = await registerUser(email, password);
    res.status(201).json({ status: 'ok', token });
  } catch (err) {
    if (err.message === 'Email already in use') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ status: 'ok', token });
  } catch (err) {
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
}
