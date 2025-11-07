"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kinde_1 = require("../config/kinde");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const basicAuth_1 = require("../middlewares/basicAuth");
const jwt = jsonwebtoken_1.default;
const router = (0, express_1.Router)();
// Handle login, register, callback and logout routes for authentication
// Followed the TS docs from Kinde (https://docs.kinde.com/developer-tools/sdks/backend/typescript-sdk/)
// createCookieSessionManager is a function that returns a sessionManager and reads/stores/deletes cookies
// The sessionManager will be passed to Kinde that will handle all the login/logout functions
router.get("/login", async (req, res) => {
    const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
    const loginUrl = await kinde_1.kindeClient.login(sessionManager);
    return res.redirect(loginUrl.toString());
});
router.get("/register", async (req, res) => {
    const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
    const registerUrl = await kinde_1.kindeClient.register(sessionManager);
    return res.redirect(registerUrl.toString());
});
// Callback after login/signup
router.get('/callback', async (req, res) => {
    try {
        const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
        // Construct URL using x-forwarded-proto if behind proxy
        const protocol = req.get('x-forwarded-proto') || req.protocol;
        const callbackUrl = new URL(req.originalUrl, `${protocol}://${req.get('host')}`);
        await kinde_1.kindeClient.handleRedirectToApp(sessionManager, callbackUrl);
        res.redirect('/?logged_in=true');
    }
    catch (err) {
        console.error('❌ Error in /api/callback:', err);
        res.status(500).send('Login failed');
    }
});
// This endpoint gets called to check the status of a user after a login
// Check if the user exist in the users table on Supabase
// If it doesn't >> it's a new user >> redirect to /complete-registration to complete the profile
router.get('/status', basicAuth_1.authWithUserProfile, async (req, res) => {
    const { data: user, error: userError } = await app_1.supabase
        .from('users')
        .select('kinde_id')
        .eq('kinde_id', req.profile?.id)
        .maybeSingle();
    if (userError) {
        console.error(userError);
        return res.status(500).json({ message: 'Something bad happened. Please try again' });
    }
    // The user has just signed up >> create row in Supabase
    // Send redirect instructions to the client
    if (!user) {
        try {
            await app_1.supabase.from('users').insert({
                'kinde_id': req.profile?.id,
                'is_profile_complete': false
            });
            return res.json({
                isAuthenticated: true,
                redirect: '/complete-registration',
                profile: req.profile
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something bad happened. Please try again' });
        }
    }
    // If the user exists in the DB >> it's a login >> return auth state (without redirect instructions)
    res.json({
        isAuthenticated: true,
        profile: req.profile
    });
});
// Handle logout
router.get("/logout", async (req, res) => {
    const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
    const logoutUrl = await kinde_1.kindeClient.logout(sessionManager);
    return res.redirect(logoutUrl.toString());
});
exports.default = router;
