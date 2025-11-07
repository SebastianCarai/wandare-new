import { Request, Response, Router } from "express";
import { authWithUserProfile } from "../../middlewares/basicAuth";
import { supabase } from "../../app";
import { PostApiSchema } from "../../types/zod-schemas";
import axios from 'axios';
import { getM2MToken } from "../../config/kinde";


const router = Router();

// Route to get user's profile information and posts
router.get('/me', authWithUserProfile, async(req: Request, res: Response) => {
    
    const {data: userPosts, error: fetchErrorsPost} = await supabase
    .from('posts')
    .select('*, stages(*)')
    .eq('author_id', req.profile?.id)

    const parsedFinalPost = userPosts?.map(post => PostApiSchema.safeParse(post).data);
    

    res.status(200).json({
        posts: parsedFinalPost,
        profileInfo: req.profile
    });
})

export default router