/// <reference path="./custom.d.ts" />

import express from 'express';
import {Request, Response} from 'express';
import config from './config/config';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('hello world!');
});

app.use('/api', authRouter);


app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})