"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWithUserProfile = exports.basicAuth = void 0;
const kinde_1 = require("../config/kinde");
const basicAuth = async function (req, res, next) {
    const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
    const isAuthenticated = await kinde_1.kindeClient.isAuthenticated(sessionManager);
    isAuthenticated ? next() : res.status(401).json({ message: 'Not authenticated' });
};
exports.basicAuth = basicAuth;
const authWithUserProfile = async function (req, res, next) {
    const sessionManager = (0, kinde_1.createCookieSessionManager)(req, res);
    try {
        const authProfile = await kinde_1.kindeClient.getUserProfile(sessionManager);
        req.profile = authProfile;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
};
exports.authWithUserProfile = authWithUserProfile;
