import { Request, Response, Router } from "express";
import { s3Client } from "../../config/config";
import { supabase } from "../../app";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { authorizedUser } from "../../middlewares/basicAuth";
import { string } from "zod";

const router = Router();

/*
    Delete image from s3 bucket and as reference on the image list
*/
router.delete('/:post_id/:image_id', authorizedUser, async(req: Request, res: Response) => {

    const {data: postImages, error: postImagesError} = await supabase
    .from('posts')
    .select('images')
    .eq('id', req.params.post_id)
    .single()

    if(postImagesError){
        return res.status(500).json({message: 'Something went wrong, please try again!'});
    }

    const bucketName = process.env.BUCKET_NAME;
    const keyToDelete = req.params.image_id;

    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: keyToDelete
    });

    try {
        await s3Client.send(command);

        console.log('before: ', postImages);
        

        const updatedImages = postImages.images.filter((image : string) => !image.includes(keyToDelete));

        console.log('after: ', updatedImages);

        const {error} = await supabase
        .from('posts')
        .update({images: updatedImages})
        .eq('id', req.params.post_id)
        
        

        res.sendStatus(204);
        
    } catch (error) {
        console.error('Error while deleting image from S3: ', error);
        
        return res.status(500).json({message: 'Something went wrong, please try again!'})
    }
})

export default router