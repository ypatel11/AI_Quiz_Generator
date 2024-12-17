import express from 'express';
import bodyParser from 'body-parser';
import quizRouter from '../routes/quizRoute.js';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from '../config/dbConnect.js';
import authRouter from '../routes/authRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';




dotenv.config();
//db connect
dbConnect();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('hello'); 
});

app.use('/auth', authRouter);
app.use('/quiz', quizRouter);

export default app;
