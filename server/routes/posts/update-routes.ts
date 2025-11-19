import { Request, Response, Router } from "express";
import dotenv from 'dotenv';
import { authorizedUser } from "../../middlewares/basicAuth";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config();
const router = Router();

router.put('/edit-post/:post_id', authorizedUser, upload.any(), async(req : Request, res: Response) => {

    console.log('req.body: ', req.body);
    
    

    res.send(200);
});

export default router