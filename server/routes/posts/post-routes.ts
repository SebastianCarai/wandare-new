import { Router, Request, Response} from "express";
import multer from 'multer';
import { authWithUserProfile } from "../../middlewares/basicAuth";
import { s3Client } from "../../config/config";
import { PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import sharp from 'sharp';
import { supabase } from "../../app";
import { PostApiSchema } from "../../types/zod-schemas";

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

class BadImageDimensionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadImageDimensionsError';
  }
}


// 1. Upload the main posts images to s3
// 2. Save the base post data to the DB
// 3. For each stage: upload stage images to s3, then save the stage data to the DB
router.post('/create-post', authWithUserProfile , upload.any(), async(req: Request, res: Response) => {    

    // Get all the images from the files
    const images = req.files as Express.Multer.File[];    

    // Each image has a "fieldname" key which is either 'postImages' (which referes to the post main images),
    // or 'stageImagesX' (that refers to specific images for each stage >> X being the stage's index)
    const postImages = images.filter(image=> image.fieldname === 'postImages');

    // Extract the stages data from the body, and for each stage attach the related images
    const stages = Object.entries(req.body)
    .filter(entry => entry[0].startsWith('stageData_'))
    .map((stage, index) => {
        const stageImages = images.filter(image=> image.fieldname === `stageImages${index}`);
        return {
            ...JSON.parse(stage[1] as string),
            images: stageImages
        }
    });

    // Get the post data (title, duration, description, etc...)
    const postData : Record<string, string> = {};
    for(const [key, value] of Object.entries(req.body)){
        if(!key.startsWith('stageData_')){
            postData[key] = value as string
        }
    }

    const bucketName = process.env.BUCKET_NAME;
    const couldfrontUrl = process.env.CLOUDFRONT_URL;

    // This function validates the metadata for each image (throws error if the image is wider than 1000px)
    // Then uploads them to the s3 bucket.
    // The function returns the Cloudfront url with the upload status:
    // "fulfilled" if the image upload was successful, and "rejected" if it failed.
    // In order to access to the fulfilled urls, you have to filter the array
    const uploadImagesToS3 = (images : Express.Multer.File[]) => {
        return images.map(async file => {
            const image = sharp(file.buffer);
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

            return { key, url: `${couldfrontUrl}/${key}` }
        })
    }

    const deleteImagesFromS3 = async (images: PromiseFulfilledResult<{ key: string; url: string }>[]) => {
        const keysToDelete = images.map(image => {
            return {Key: image.value.key}
        });

        const command = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: keysToDelete
            }
        });

        await s3Client.send(command);
    }

    // Upload the post images. If there is an error >> delete the uploaded images
    // Then check type of error: if it's a BadImageDimensionsError >> return 400 status
    // Otherwise it was an s3 upload error >> return 500 status
    const savedPostImages = await Promise.allSettled(uploadImagesToS3(postImages));
    const uploadedPostImages = savedPostImages.filter((r): r is PromiseFulfilledResult<{ key: string; url: string }> => r.status === "fulfilled");
    const rejectedPostImages = savedPostImages.filter((r): r is PromiseRejectedResult => r.status === "rejected");

    if(rejectedPostImages.length > 0){

        await deleteImagesFromS3(uploadedPostImages);

        if(rejectedPostImages.some(r => r.reason instanceof BadImageDimensionsError)){
            return res.status(400).json({message: 'Bad post image dimensions'});
        }else{
            console.error(`Error while uploading post images to s3. 
                User: ${req.profile?.id}. 
                Rejected images: `, rejectedPostImages);
            return res.status(500).json({message: 'Something bad happened. Please try again'});
        }
    }


    // Create and retrieve the post record in the db
    const { data: newPost, error: uploadPostError} = await supabase
    .from('posts')
    .insert({
        title: postData.title,
        author_id: req.profile!.id,
        author_name: `${req.profile!.given_name} ${req.profile!.family_name}`,
        images: uploadedPostImages.map(image => image.value.url),
        duration: postData.duration,
        description: postData.duration,
        what_to_bring: postData.whatToBring,
        pricing: postData.pricing,
        required_documents: postData.documents,
    })
    .select()
    .single();

    // Supabase post upload error >> log the error, fallback and delete the uploaded images, and return 500 status
    if(uploadPostError){
        console.log('Error uploading base post data to DB: ', uploadPostError);
        await deleteImagesFromS3(uploadedPostImages);
        return res.status(500).json({message: 'Something bad happened. Please try again'});
    }

    // For each stage upload images (with error handling)
    // Then create and retrieve the stage record in the db
    const uploadedStages = Promise.all(stages.map(async stage => {
        const stageImages = await Promise.allSettled(uploadImagesToS3(stage.images));
        const uploadedStageImages = stageImages.filter((r): r is PromiseFulfilledResult<{ key: string; url: string }> => r.status === "fulfilled");
        const rejectedStageImages = stageImages.filter((r): r is PromiseRejectedResult => r.status === "rejected");

        // Check if the error is a dimension error, or an upload error
        if(rejectedStageImages.length > 0){
            await deleteImagesFromS3(uploadedStageImages);

            const dimensionError = rejectedStageImages.find(r => r.reason instanceof BadImageDimensionsError);
            if(dimensionError) throw new BadImageDimensionsError('Bad image dimensions');

            console.error(`Error while uploading post images to s3. 
                User: ${req.profile?.id}. 
                Stage: ${stage}.
                Rejected images: `, rejectedStageImages);
            throw new Error('S3 upload error')
        }

        // Create stage record in the DB
        const {data: newStageData, error: uploadStageError} = await supabase.from('stages')
        .insert({
            post_id: newPost.id,
            name: stage.stageName,
            type: stage.type,
            latitude: stage.coordinates[0],
            longitude: stage.coordinates[1],
            description: stage.stageDescription,
            images: uploadedStageImages.map(image => image.value.url)
        }).select().single();

        if(uploadStageError){
            await deleteImagesFromS3(uploadedStageImages);
            console.error('Supabase stage upload error: ', uploadStageError);
            throw new Error('Supabase stage upload error');
        }

        return newStageData
    }));

    // Call the concurrent stages upload, compose and send the final data 
    try {
        const finalStages = await uploadedStages;
        const finalPost = {
            ...newPost,
            stages: finalStages.map((stage: Record<string, any>) => stage.data || null)
        }

        const formattedFinalPost = PostApiSchema.safeParse(finalPost);
        return res.status(201).json(formattedFinalPost);
    } catch (error: any) {
        if(error instanceof BadImageDimensionsError){
            return res.status(400).json({message: 'Bad image dimensions'});
        }else{
            return res.status(500).json({message: 'Something bad happened. Please try again'});
        }
    }
});

export default router;