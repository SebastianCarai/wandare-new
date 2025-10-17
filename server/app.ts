/// <reference path="./custom.d.ts" />

import express from 'express';
import {Request, Response} from 'express';
import config from './config/config';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import authRouter from './routes/auth';
import postRouter from './routes/posts/index';
import dotenv from 'dotenv';
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";


export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const app = express();

app.use(cors({
  origin: 'https://wandare.io',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

app.use('/api', authRouter);
app.use('/api/posts', postRouter);

// --- Serve Vue static files ---
const distPath = path.join(__dirname, "../client/dist");

// Serve static Vue files
app.use(express.static(distPath));
// Catch-all fallback for SPA (everything except /api)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  res.setHeader('Cache-Control', 'no-store');

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})