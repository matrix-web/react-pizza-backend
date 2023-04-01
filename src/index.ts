import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './router';
import { errorMiddleware } from './middleware/error';

dotenv.config();

const PORT = process.env.PORT;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`${process.env.DB_URL}`);

    app.listen(PORT, () =>
      console.log(`[server] Server is running on http://localhost:${PORT}`),
    );
  } catch (err) {
    console.log('Internal server error', err);
  }
};

start();
