import express from 'express';
import { userAuth } from '../middlewares/user.auth.js';
import { generate } from '../controller/letter.controller.js';


const router=express.Router();


router.post('/generate',userAuth,generate)

export default router;