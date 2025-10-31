"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_routes_1 = __importDefault(require("./get-routes"));
const post_routes_1 = __importDefault(require("./post-routes"));
const delete_routes_1 = __importDefault(require("./delete-routes"));
const router = (0, express_1.Router)();
router.use('/', get_routes_1.default);
router.use('/', post_routes_1.default);
router.use('/', delete_routes_1.default);
exports.default = router;
