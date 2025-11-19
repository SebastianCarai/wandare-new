import { Request, Response, NextFunction } from "express";
import { createCookieSessionManager, kindeClient } from "../config/kinde";
import { supabase } from "../app";


export const basicAuth = async function(req: Request, res: Response, next: NextFunction){
    const sessionManager = createCookieSessionManager(req, res);

    const isAuthenticated = await kindeClient.isAuthenticated(sessionManager);

    isAuthenticated ? next() : res.status(401).json({message: 'Not authenticated'});
}


export const authWithUserProfile = async function(req: Request, res: Response, next: NextFunction){
    const sessionManager = createCookieSessionManager(req, res);

    try {
        const authProfile = await kindeClient.getUserProfile(sessionManager);        
        
        req.profile = authProfile;        

        next();
    } catch (error) {
        return res.status(401).json({message: 'Not authenticated'});
    }    
}

/*
    Middleware that checks if the user making the request is authorized

    @Code
    Check if the request is authenticated >> if not return 401 status
    Query the post author from Supabase >> at error return 500 error
    If the post author and the user making the request don't match return 403 status
    Otherwise go next()
*/
export const authorizedUser = async function(req: Request, res: Response, next: NextFunction){
    const sessionManager = createCookieSessionManager(req, res);
    

    try {
        const authProfile = await kindeClient.getUserProfile(sessionManager);        
        
        req.profile = authProfile;

        const {data: postData, error: postError} = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', req.params.post_id)
        .single()
        

        if(postError){
            if(postError.code === 'PGRST116') return res.status(404).json({message: "Post not found"})

            console.error('[authorizedUser] Error while fetching author_id from Supabase: ', postError);
            return res.status(500).json({message: 'Something went wrong. Please try again!'});
        }

        if(postData.author_id !== authProfile.id) return res.status(403).json({message: 'Not authorized'});

        next();
    } catch (error) {
        return res.status(401).json({message: 'Not authenticated'});
    }    
}