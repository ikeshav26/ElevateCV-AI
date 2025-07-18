import express from 'express';
import { userAuth } from '../middlewares/user.auth.js';
import { generate, getAllLetters, getLetter,deleteLetter,changeVisibility, exploreLetters } from '../controller/letter.controller.js';


const router=express.Router();


router.post('/generate',userAuth,generate)
router.get('/all',userAuth,getAllLetters)
router.get('/explore',userAuth,exploreLetters)
router.delete('/delete/:id',userAuth,deleteLetter)
router.get('/:id',userAuth,getLetter)
router.get('/visibility/:id',userAuth,changeVisibility)

export default router;