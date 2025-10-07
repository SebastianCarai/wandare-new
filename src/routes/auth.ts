import { Router } from "express";
import {kindeClient, createCookieSessionManager } from "../config/kinde"
import jsonwebtoken from 'jsonwebtoken';
import { basicAuth, authWithUserProfile } from "../middlewares/basicAuth";

const jwt = jsonwebtoken;

const router = Router();

// Handle login, register, callback and logout routes for authentication
// Followed the TS docs from Kinde (https://docs.kinde.com/developer-tools/sdks/backend/typescript-sdk/)
// createCookieSessionManager is a function that returns a sessionManager and reads/stores/deletes cookies
// The sessionManager will be passed to Kinde that will handle all the login/logout functions
router.get("/login", async (req, res) => {  

  const sessionManager = createCookieSessionManager(req, res);
  const loginUrl = await kindeClient.login(sessionManager);  
  return res.redirect(loginUrl.toString());
});

router.get("/register", async (req, res) => {
  const sessionManager = createCookieSessionManager(req, res);
  const registerUrl = await kindeClient.register(sessionManager);
  return res.redirect(registerUrl.toString());
});

router.get('/test', authWithUserProfile, async (req, res) => {
  const sessionManager = createCookieSessionManager(req, res);
  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager);
  const profile = await kindeClient.getUserProfile(sessionManager);

  
  res.sendStatus(200);
})



// Callback after login
router.get("/callback", async (req, res, next) => {
    try {
    const sessionManager = createCookieSessionManager(req, res);

    const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);    

    // Kinde will automatically processes the auth response 
    // and store tokens in the session as cookies
    await kindeClient.handleRedirectToApp(sessionManager, url);

    // Redirect to homepage
    res.redirect("/");
    } catch (err) {
        console.error('Error while handling callback', err);
        res.status(500).json({message: 'Error while loggin in'});
    }
});

// Handle logout
router.get("/logout", async (req, res) => {
    const sessionManager = createCookieSessionManager(req, res);
    const logoutUrl = await kindeClient.logout(sessionManager);
    return res.redirect(logoutUrl.toString());
});


export default router;