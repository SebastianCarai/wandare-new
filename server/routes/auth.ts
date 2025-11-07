import { Router } from "express";
import {kindeClient, createCookieSessionManager } from "../config/kinde"
import jsonwebtoken from 'jsonwebtoken';
import { supabase } from "../app";
import { authWithUserProfile } from "../middlewares/basicAuth";

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


// Callback after login/signup
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

// This endpoint gets called to check the status of a user after a login
// Check if the user exist in the users table on Supabase
// If it doesn't >> it's a new user >> redirect to /complete-registration to complete the profile
router.get('/status', authWithUserProfile, async (req, res) => {

  const {data: user, error: userError} = await supabase
  .from('users')
  .select('kinde_id')
  .eq('kinde_id', req.profile?.id)
  .maybeSingle()

  if(userError) {
    console.error(userError);
    return res.status(500).json({message: 'Something bad happened. Please try again'});
  }

  // The user has just signed up >> create row in Supabase
  // Send redirect instructions to the client
  if(!user){
    try {
      await supabase.from('users').insert({
        'kinde_id':req.profile?.id,
        'is_profile_complete': false
      });
      
      return res.json({
        isAuthenticated : true,
        redirect: '/complete-registration',
        profile: req.profile
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Something bad happened. Please try again'});
    }
  }

  // If the user exists in the DB >> it's a login >> return auth state (without redirect instructions)
  res.json({ 
    isAuthenticated : true,
    profile: req.profile
  });
});

// Handle logout
router.get("/logout", async (req, res) => {
    const sessionManager = createCookieSessionManager(req, res);
    const logoutUrl = await kindeClient.logout(sessionManager);
    return res.redirect(logoutUrl.toString());
});


export default router;