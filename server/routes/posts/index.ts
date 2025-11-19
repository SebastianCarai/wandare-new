import { Router, Request, Response} from "express";
import { Post } from "../../types";
import test from "node:test";
import getRoutes from './get-routes';
import postRoutes from "./post-routes";
import updateRoutes from './update-routes';
import deleteRoutes from './delete-routes';

const router = Router();

router.use('/', getRoutes);
router.use('/', postRoutes);
router.use('/', updateRoutes);
router.use('/', deleteRoutes);

export default router;