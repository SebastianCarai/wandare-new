"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getM2MToken = exports.kindeClient = void 0;
exports.createCookieSessionManager = createCookieSessionManager;
const kinde_typescript_sdk_1 = require("@kinde-oss/kinde-typescript-sdk");
const axios_1 = __importDefault(require("axios"));
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
// M2M Config
let m2mToken = null;
let tokenExpiry = 0;
// Get access token to make request to the Kinde API
// Save token and expiry time in memory
// Return cached token if valid, otherwise request a new one
const getM2MToken = async function () {
    const now = Date.now();
    // Safety buffer >> It avoids using a token that’s about to expire mid-request.
    if (m2mToken && now < tokenExpiry - 60000)
        return m2mToken;
    const tokenConfig = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.KINDE_M2M_CLIENT_ID,
        client_secret: process.env.KINDE_M2M_CLIENT_SECRET,
        audience: `${process.env.KINDE_DOMAIN}/api`
    });
    try {
        const response = await axios_1.default.post(`${process.env.KINDE_DOMAIN}/oauth2/token`, tokenConfig.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token, expires_in } = response.data;
        m2mToken = access_token;
        // Take the current milliseconds since the epoch, 
        // and add how many milliseconds (expires_in (seconds) *1000) the token will live.
        // This gives another epoch-based timestamp representing the moment the token expires.
        tokenExpiry = now + expires_in * 1000;
        return m2mToken;
    }
    catch (error) {
        throw new Error('Error while fetching M2M token');
    }
};
exports.getM2MToken = getM2MToken;
