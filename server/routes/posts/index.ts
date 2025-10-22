import { Router, Request, Response} from "express";
import { Post } from "../../types";
import test from "node:test";
import postRoutes from "./post-routes";
import GetRoutes from './get-routes'

const router = Router();

router.use('/', GetRoutes);
router.use('/', postRoutes);

export default router;