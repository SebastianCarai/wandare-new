import Router, { Request, Response } from 'express';
import { supabase } from '../../app';
import type { Post } from '../../types';
import { authWithUserProfile } from '../../middlewares/basicAuth';
import { PostApiSchema, BasePostApiSchema } from '../../types/zod-schemas';
import { parse } from 'path';

const router = Router();

router.get('/', authWithUserProfile,  async(req: Request, res: Response) => {

    const {data: postsFeed, error: postDetailsError} = await supabase
    .from('posts')
    .select()
    .neq('author_id', req.profile?.id)
    .limit(9)

    if(postDetailsError){
        console.error(postDetailsError);
        throw new Error('Error while fetching from supabase')
    }

    if(postsFeed.length === 0){
        return res.status(404).json({message: "We're sorry. We ran out of posts"});
    }

    // Format the posts based on the BasePostApiSchema and return only what is being properly formatted
    const formattedPosts = postsFeed
        .map(post => BasePostApiSchema.safeParse(post))
        .filter(result => result.success)
        .map(formattedPost => formattedPost.data)


    if(formattedPosts.length === 0){
        return res.status(500).json({message: 'Something went wrong. Please try again'});
    }
    

    res.status(200).json(formattedPosts);
});

// Post details route
router.get('/:id', async(req: Request, res: Response) => {

    const id : number = parseInt(req.params.id as string);

    const {data, error: postDetailsError} = await supabase
    .from('posts')
    .select(`*, stages(*)`)
    .eq('id', id)
    .single()

    if(!data) return res.status(404).json({message: 'Post not found'});

    if(postDetailsError){
        console.error('Supabase post details fetching error: ', postDetailsError);
        return res.status(500).json({message: 'Something went wrong. Please try again'});
    }

    const parsedFinalPost = PostApiSchema.safeParse(data);  
    if(!parsedFinalPost.success){
        return res.status(500).json({message: 'Something went wrong. Please try again'});
    }
        
    res.status(200).json(parsedFinalPost);


})


export default router