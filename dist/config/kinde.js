"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kindeClient = void 0;
exports.createCookieSessionManager = createCookieSessionManager;
const kinde_typescript_sdk_1 = require("@kinde-oss/kinde-typescript-sdk");
// Setup Kinde
exports.kindeClient = (0, kinde_typescript_sdk_1.createKindeServerClient)(kinde_typescript_sdk_1.GrantType.AUTHORIZATION_CODE, {
    authDomain: process.env.KINDE_ISSUER_URL,
    clientId: process.env.KINDE_CLIENT_ID,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    redirectURL: process.env.KINDE_REDIRECT_URI,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI
});
// Function that returns a sessionManager and reads/stores/deletes cookies
function createCookieSessionManager(req, res) {
    return {
        // Get cookie value from key
        async getSessionItem(key) {
            const value = req.cookies[key];
            return value ? JSON.parse(value) : null;
        },
        // Save cookie
        async setSessionItem(key, value) {
            res.cookie(key, JSON.stringify(value), {
                httpOnly: true, // protect from JS access
                secure: true, // only over https
                sameSite: "none", // CSRF protection
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
            });
        },
        // Delete specific cookie
        async removeSessionItem(key) {
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
