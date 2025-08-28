import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { JWT_SECRET } from '../utils/envConfig';

dotenv.config();

const router: Router = express.Router();

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

// Sign up
export const registerRouter = router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password, name });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload,`${JWT_SECRET}`, { expiresIn: '1h' }, (err: any, token: any) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login 
