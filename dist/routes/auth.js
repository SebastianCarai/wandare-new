"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kinde_1 = require("../config/kinde");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
// Callback after login
router.get('/callback', async (req, res) => {
    try {
        const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
        // Construct URL using x-forwarded-proto if behind proxy
        const protocol = req.get('x-forwarded-proto') || req.protocol;
        const callbackUrl = new URL(req.originalUrl, `${protocol}://${req.get('host')}`);
        console.log('Callback URL:', callbackUrl.toString());
        await kinde_1.kindeClient.handleRedirectToApp(sessionManager, callbackUrl);
        res.redirect('/?logged_in=true');
    }
    catch (err) {
        console.error('❌ Error in /api/callback:', err);
        res.status(500).send('Login failed');
    }
});
router.get('/status', async (req, res) => {
    try {
        const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
        const isAuthenticated = await kinde_1.kindeClient.isAuthenticated(sessionManager);
        if (isAuthenticated) {
            return res.json({ isAuthenticated: true });
        }
        res.json({ isAuthenticated: false });
    }
    catch (error) {
        res.json({ isAuthenticated: false });
    }
});
// Handle logout
router.get("/logout", async (req, res) => {
    const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
    const logoutUrl = await kinde_1.kindeClient.logout(sessionManager);
    return res.redirect(logoutUrl.toString());
});
exports.default = router;
