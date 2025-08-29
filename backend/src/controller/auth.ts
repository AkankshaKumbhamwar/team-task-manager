import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { JWT_SECRET } from '../utils/envConfig';

dotenv.config();

export const authRouter: Router = express.Router();

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

// Sign up
authRouter.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password, name });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, `${JWT_SECRET}`, { expiresIn: '1h' }, (err: any, token: any) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login 
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, `${JWT_SECRET}`, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.json({ msg: 'Logged out successfully' });
});
