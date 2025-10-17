import { Router, Request, Response} from "express";
import multer from 'multer';
import { authWithUserProfile } from "../../middlewares/basicAuth";
import { s3Client } from "../../config/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import sharp from 'sharp';
import { supabase } from "../../app";

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

export function generateRandomString(length: number) : string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/create-post', authWithUserProfile , upload.any(), async(req: Request, res: Response) => {    

    const images = req.files as Express.Multer.File[];    

    const postImages = images.filter(image=> image.fieldname === 'postImages');

    const stages = Object.entries(req.body)
    .filter(entry => entry[0].startsWith('stageData_'))
    .map((stage, index) => {
        const stageImages = images.filter(image=> image.fieldname === `stageImages${index}`);
        return {
            ...JSON.parse(stage[1] as string),
            images: stageImages
        }
    });

    const postData : Record<string, string> = {};

    for(const [key, value] of Object.entries(req.body)){
        if(!key.startsWith('stageData_')){
            postData[key] = value as string
        }
    }

    const bucketName = process.env.BUCKET_NAME;
    const couldfrontUrl = process.env.CLOUDFRONT_URL;

    const uploadImagesToS3 = async function(images : Express.Multer.File[]){
        return images.map(async file => {
            const image = sharp(file.buffer);
            const metadata = await image.metadata();

            if(metadata.width > 1000 || metadata.height > 1000){
                return res.status(400).json({message: "Bad request"});
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

            return { key, url: `${couldfrontUrl}/${key}` }
        })
    }    

    const savedPostImages = await Promise.allSettled(await uploadImagesToS3(postImages));
    const uploadedPostImages = savedPostImages.filter((r): r is PromiseFulfilledResult<{ key: string; url: string }> => r.status === "fulfilled");

    const { data: newPost, error: uploadPostError} = await supabase
    .from('posts')
    .insert({
        title: postData.title,
        author: req.profile!.id,
        images: uploadedPostImages.map(image => image.value.url),
        duration: postData.duration,
        description: postData.duration,
        what_to_bring: postData.whatToBring,
        pricing: postData.pricing,
        required_documents: postData.documents,
    })
    .select()
    .single();

    if(uploadPostError){
        return res.status(500).json({message: 'Something bad happened'});
    }
    // ! TO DO : Handle the rejected images >> status === "rejected"    

    stages.forEach(async stage => {
        const stageImages = await Promise.allSettled(await uploadImagesToS3(stage.images));
        const uploadedStageImages = stageImages.filter((r): r is PromiseFulfilledResult<{ key: string; url: string }> => r.status === "fulfilled");

        try {
            const { data: uploadedStage, error: uploadStageError} = await supabase
            .from('stages')
            .insert({
                post_id: newPost.id,
                name: stage.stageName,
                latitude: stage.coordinates[0],
                longitude: stage.coordinates[1],
                description: stage.stageDescription,
                images: uploadedStageImages.map(image => image.value.url)
            })
            .select();
            
            console.log(uploadedStage);            
        } catch (error) {
            console.error(error);
        }
    });


    
    
    res.status(201).json({ message: 'Post created successfully' });
});

export default router;