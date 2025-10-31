import { Router } from "express";
import GetRoutes from './get-routes';

const router = Router();

router.use(GetRoutes)

export default router