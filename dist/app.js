"use strict";
/// <reference path="./custom.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.supabase = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const supabase_js_1 = require("@supabase/supabase-js");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const index_1 = __importDefault(require("./routes/posts/index"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: 'https://wandare.io',
    credentials: true
}));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.set("trust proxy", true);
exports.app.use('/api', auth_1.default);
exports.app.use('/api/posts', index_1.default);
// --- Serve Vue static files ---
const distPath = path_1.default.join(__dirname, "../client/dist");
// Serve static Vue files
exports.app.use(express_1.default.static(distPath));
// Catch-all fallback for SPA (everything except /api)
exports.app.use((req, res, next) => {
    if (req.path.startsWith('/api'))
        return next();
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(path_1.default.join(distPath, "index.html"));
});
exports.app.listen(config_1.default.port, () => {
    console.log(`Server running on port ${config_1.default.port}`);
});
