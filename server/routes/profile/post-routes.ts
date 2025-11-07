import { Request, Response, Router } from "express";
import { authWithUserProfile } from "../../middlewares/basicAuth";
import multer from "multer";
import { s3Client } from "../../config/config";
import { getM2MToken } from "../../config/kinde";
import axios from 'axios';
import dotenv from 'dotenv';
import sharp from 'sharp';
import {BadImageDimensionsError} from "../posts/post-routes";
import { generateRandomString } from "../posts/post-routes";
import { PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/complete-profile', authWithUserProfile, upload.single('profile_picture'), async (req: Request , res: Response) => {
    const {username, bio} = req.body;
    const profilePicture = req.file as Express.Multer.File;

    console.log(username);
    

    try {
        const token = await getM2MToken();
        
        const bucketName = process.env.BUCKET_NAME;
        const couldfrontUrl = process.env.CLOUDFRONT_URL;

        const image = sharp(profilePicture.buffer);
        const metadata = await image.metadata();

        if(metadata.width > 1000 || metadata.height > 1000){
            throw new BadImageDimensionsError('Bad image dimensions');
        }

        const webpImage = await image.webp({ quality: 90}).toBuffer();
        const key = generateRandomString(32);

        const imageParams = {
            Bucket: bucketName,
            Body: webpImage,
            ContentType: 'image/webp',
            Key: key
        }

        await s3Client.send(new PutObjectCommand(imageParams));

        const profilePictureUrl = `${couldfrontUrl}/${key}`;

        const m2mHeaders = {
            'Authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        }

        const [updatedProfilePicture, updatedDisplayUsername] = await Promise.all([
            axios.patch(`${process.env.KINDE_DOMAIN}/api/v1/user?id=${req.profile?.id}`,{
                picture: profilePictureUrl,
            }, { headers: m2mHeaders }),
            axios.patch(`${process.env.KINDE_DOMAIN}/api/v1/users/${req.profile?.id}/properties`,{
                properties: {
                    display_username: username,
                    bio
                }
            }, { headers: m2mHeaders })
        ])

        console.log(updatedProfilePicture, updatedDisplayUsername);
        
            

    } catch (error) {
        console.error(error);

        if(error instanceof BadImageDimensionsError){
            return res.status(400).json({message: 'Bad image dimensions'})
        }
        return res.status(500).json({message: 'Something bad happened. Please try again'})
    }    
})

export default router

