import { Router, Request, Response} from "express";
import { Post } from "../../types";
import test from "node:test";
import GetRoutes from './get-routes';
import PostRoutes from "./post-routes";
import DeleteRoutes from './delete-routes';

const router = Router();

router.use('/', GetRoutes);
router.use('/', PostRoutes);
router.use('/', DeleteRoutes);

export default router;