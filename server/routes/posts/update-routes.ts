import { Request, Response, Router } from "express";
import dotenv from 'dotenv';
import { authorizedUser } from "../../middlewares/basicAuth";
import multer from "multer";
import { supabase } from "../../app";

const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config();
const router = Router();

router.put('/edit-post/:post_id', authorizedUser, upload.any(), async(req : Request, res: Response) => {

    const newImages = req.files;


    // Convert formData in JSON object
    const updatedFields : Record<string, string | []> = {};
    for(const [key, value] of Object.entries(req.body)){
        if(!key.startsWith('stageData_')){
            if(key === 'mapCenter'){
                updatedFields[key] = JSON.parse("[" + value as string + "]");
            }else{
                updatedFields[key] = value as string;
            }
        }
    }

    // Properly format the what_to_bring key, so it can be directly passed in the query with the whole object
    if(updatedFields.whatToBring){
        updatedFields.what_to_bring = updatedFields.whatToBring;
        delete updatedFields.whatToBring
    } 

    // If the user sends an empty title or duration, return 400 error since they are required
    if(
        (updatedFields.title && updatedFields.title.length === 0) ||
        (updatedFields.duration && updatedFields.duration.length === 0)
    ) {
        (req.files as Express.Multer.File[]).forEach(file => delete (file as any).buffer);
        delete req.files;
        return res.status(400).json({message: 'Missing minimum required data'});
    }


    // Update row in DB
    const {error: updateError} = await supabase
    .from('posts')
    .update({
        ...updatedFields,
        updated_at: new Date()
    })
    .eq('id', req.params.post_id)

    if(updateError){
        console.error('Error while updating post: ', updateError);
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
});

export default router