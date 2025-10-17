// Config file for port and environment

import dotenv from 'dotenv';
import { S3Client } from "@aws-sdk/client-s3"

dotenv.config();

interface Config{
    port : number,
    nodeEnv : string
}

const config : Config = {
    port : Number(process.env.PORT) || 3000,
    nodeEnv : process.env.NODE_ENV || 'development'
}

const region = process.env.AWS_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})


export default config;