import express from 'express';
import { userAuth } from '../middlewares/user.auth.js';
import { generate, getAllLetters, getLetter } from '../controller/letter.controller.js';


const router=express.Router();


router.post('/generate',userAuth,generate)
router.get('/all',userAuth,getAllLetters)
router.get('/:id',userAuth,getLetter)

export default router;