import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import accountRouter from './routers/accountRouter.js';
import corsConfig from "./config/corsConfig.js";
import { globalErrorHandler } from './middlewares/errorHandler.middleware.js';

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express()
app.use(corsConfig())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const DB_USER = process.env.MONGODB_USERNAME
const DB_PASS = process.env.MONGODB_PASSWORD
const DB_NAME = process.env.DB_NAME

const DATABASE_URL = `mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}?authSource=admin`

mongoose.connect(DATABASE_URL)
    .then(
    () => console.log('MongoDB Connected to ' + mongoose.connection.name)
).catch(err => console.log('Error occurred connecting to mongoDB: ' + err.message));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get("/health", async (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date(),
    };

    try {
        const dbStatus = mongoose.connection.readyState;
        if (dbStatus !== 1) {
            throw new Error("Database connection failed");
        }
        res.send(healthCheck);
    }catch(err) {
        healthCheck.message = err.message;
        res.status(500).send({error: healthCheck});
    }
})

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT)
})