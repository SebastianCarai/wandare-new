"use strict";
// GET routes for posts:
// Posts feed
// Post details
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const basicAuth_1 = require("../../middlewares/basicAuth");
const zod_schemas_1 = require("../../types/zod-schemas");
const router = (0, express_1.default)();
// Posts feed >> Get other user's posts
router.get('/', basicAuth_1.authWithUserProfile, async (req, res) => {
    const { data: postsFeed, error: postDetailsError } = await app_1.supabase
        .from('posts')
        .select()
        .neq('author_id', req.profile?.id)
        .limit(9);
    if (postDetailsError) {
        console.error(postDetailsError);
        throw new Error('Error while fetching from supabase');
    }
    if (postsFeed.length === 0) {
        return res.status(404).json({ message: "We're sorry. We ran out of posts" });
    }
    // Format the posts based on the BasePostApiSchema and return only what is being properly formatted
    const formattedPosts = postsFeed
        .map(post => zod_schemas_1.BasePostApiSchema.safeParse(post))
        .filter(result => result.success)
        .map(formattedPost => formattedPost.data);
    if (formattedPosts.length === 0) {
        return res.status(500).json({ message: 'Something went wrong. Please try again' });
    }
    // Cache feed for 10 minutes
    const cacheTime = 60 * 10;
    res.set('Cache-Control', `public, max-age=${cacheTime}`);
    res.json(formattedPosts);
});
// Post details route
router.get('/:id', async (req, res) => {
    // Get post id from url
    const id = parseInt(req.params.id);
    // Query for post details and stages
    const { data, error: postDetailsError } = await app_1.supabase
        .from('posts')
        .select(`*, stages(*)`)
        .eq('id', id)
        .single();
    if (!data)
        return res.status(404).json({ message: 'Post not found' });
    if (postDetailsError) {
        console.error('Supabase post details fetching error: ', postDetailsError);
        return res.status(500).json({ message: 'Something went wrong. Please try again' });
    }
    // Format and return the post
    const parsedFinalPost = zod_schemas_1.PostApiSchema.safeParse(data);
    if (!parsedFinalPost.success) {
        return res.status(500).json({ message: 'Something went wrong. Please try again' });
    }
    // Cache post details for one hour
    const cacheTime = 60 * 60;
    res.set('Cache-Control', `public, max-age=${cacheTime}`);
    res.json(parsedFinalPost);
});
exports.default = router;
