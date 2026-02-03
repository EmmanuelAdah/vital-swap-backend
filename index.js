import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import authRouter from './router/authRouter.js';
import corsConfig from "./config/corsConfig.js";
import { globalErrorHandler } from './middlewares/errorHandler.middleware.js';

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express()
app.use(corsConfig())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGODB_URI).then(
    () => console.log('MongoDB Connected to ' + mongoose.connection.name)
).catch(err => console.log('Error occured connecting to mongoDB: ' + err.message));

app.use(globalErrorHandler)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT)
})