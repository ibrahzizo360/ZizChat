import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes'; 
import chatRoutes from './routes/chatRoutes'; 
import cors from 'cors';

const app = express();
dotenv.config();
connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
