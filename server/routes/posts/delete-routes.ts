import { Request, Response, Router } from "express";
import { authWithUserProfile } from "../../middlewares/basicAuth";
import { supabase } from "../../app";
import { s3Client } from "../../config/config";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
const router = Router();

router.delete('/:id', async(req: Request, res: Response) => {
    const postId = req.params.id;

    const {data: postData, error: postAuthorError} = await supabase
    .from('posts')
    .select('images, author_id, stages(images)',)
    .eq('id', postId)
    .single()
    
    const imagesToDelete : string[] = [...postData?.images, ...postData?.stages.map(stage => stage.images).flat() as string[]];

    const keysToDelete = imagesToDelete.map(image => image.split('.net/')[1]);
    
    const bucketName = process.env.BUCKET_NAME;
    const deleteImagesFromS3 = async (images: string[]) => {
        const keysToDelete = images.map(image => {
            return {Key: image}
        });

        const command = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: keysToDelete
            }
        });

        await s3Client.send(command);
    }

    if(postAuthorError){
        console.error('Error while fetching from supabase', postAuthorError);
        return res.status(500).json({message: 'Something went wrong. Please try again'});
    }

    if(postData.author_id !== req.profile?.id){
        return res.status(403).json({message: 'Not authorized to delete this post'});
    }else{

        Promise.all([
            supabase
            .from('posts')
            .delete()
            .eq('id', postId),

            deleteImagesFromS3(keysToDelete)
        ])
    }
    
    
});

export default router