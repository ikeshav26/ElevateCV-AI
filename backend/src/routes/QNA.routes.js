import express from 'express';
import { generateQNA } from '../controller/QNA.js';
import { userAuth } from '../middlewares/user.auth.js';


const router = express.Router();


router.post('/generate',userAuth,generateQNA)



export default router;