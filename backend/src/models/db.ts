import mongoose from 'mongoose';
import dotenv from "dotenv"
import { MONGO_URI } from '../utils/envConfig';

const connectDB = async (): Promise<any> => {
  try {
    await mongoose.connect(`${MONGO_URI}`);
    console.log('MongoDB connected');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;