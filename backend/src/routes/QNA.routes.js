import express from 'express';
import { generateQNA } from '../controller/qna.controller.js';
import { userAuth } from '../middlewares/user.auth.js';


const router = express.Router();


router.post('/generate',userAuth,generateQNA)



export default router;