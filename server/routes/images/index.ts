import { Router } from "express";
import deleteRoutes from './delete'

const router = Router();

router.use('/', deleteRoutes);

export default router