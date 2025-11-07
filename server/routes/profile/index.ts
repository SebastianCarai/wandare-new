import { Router } from "express";
import GetRoutes from './get-routes';
import PostRoutes from './post-routes';

const router = Router();

router.use(GetRoutes);
router.use(PostRoutes);

export default router