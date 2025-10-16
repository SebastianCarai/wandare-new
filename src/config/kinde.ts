import {createKindeServerClient, GrantType, SessionManager} from "@kinde-oss/kinde-typescript-sdk";
import { Request, Response } from "express";

// Setup Kinde
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_ISSUER_URL!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!
});


// Function that returns a sessionManager and reads/stores/deletes cookies
export function createCookieSessionManager(req: Request, res: Response): SessionManager {  

  return {
    // Get cookie value from key
    async getSessionItem(key: string) 
    {       
      const value = req.cookies[key];
      return value ? JSON.parse(value) : null;
    },
    // Save cookie
    async setSessionItem(key: string, value: unknown) {      
      res.cookie(key, JSON.stringify(value), {
        httpOnly: true,   // protect from JS access
        secure: true, // only over https
        sameSite: "none",  // CSRF protection
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      });
    },
    // Delete specific cookie
    async removeSessionItem(key: string) {
      res.clearCookie(key);
    },
    // Delete all cookies
    async destroySession() {
      Object.keys(req.cookies).forEach(cookieName => {
        res.clearCookie(cookieName);
      });
    }
  };
}
