import express from 'express';
import { userAuth } from '../middlewares/user.auth.js';
import { generateCoverLetter } from '../controller/letter.controller.js';


const router=express.Router();


router.post('/generate',userAuth,generateCoverLetter)

export default router;