import { Request, Response, NextFunction } from "express";
import { createCookieSessionManager, kindeClient } from "../config/kinde";

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