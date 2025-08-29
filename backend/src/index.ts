import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import connectDB from './models/db';
import { routes } from './routes';
import { PORT } from './utils/envConfig';

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(PORT || 3000, () => console.log(`Server running on port ${PORT}`));