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


// Callback after login
router.get('/callback', async (req, res) => {
  try {
    const sessionManager = createCookieSessionManager(req, res);

    // Construct URL using x-forwarded-proto if behind proxy
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const callbackUrl = new URL(req.originalUrl, `${protocol}://${req.get('host')}`);

    await kindeClient.handleRedirectToApp(sessionManager, callbackUrl);

    res.redirect('/?logged_in=true');
  } catch (err) {
    console.error('❌ Error in /api/callback:', err);
    res.status(500).send('Login failed');
  }
});

router.get('/status', async (req, res) => {  
  try {
    const sessionManager = createCookieSessionManager(req, res);
    const isAuthenticated = await kindeClient.isAuthenticated(sessionManager);

    if(isAuthenticated){
      return res.json({ isAuthenticated : true });
    }
    
    res.json({ isAuthenticated : false });

  } catch (error) {
    res.json({ isAuthenticated : false });
  }
});

// Handle logout
router.get("/logout", async (req, res) => {
    const sessionManager = createCookieSessionManager(req, res);
    const logoutUrl = await kindeClient.logout(sessionManager);
    return res.redirect(logoutUrl.toString());
});


export default router;