import express from "express";
import { deleteResume, exploreResumes, generate, getAllResumes, getResume } from "../controller/resume.controller.js";
import { userAuth } from "../middlewares/user.auth.js";


const router=express.Router();


router.post('/generate',userAuth,generate)
router.get('/all',userAuth,getAllResumes)
router.get('/explore',userAuth,exploreResumes)
router.get('/:id',userAuth,getResume)
router.delete('/delete/:id',userAuth,deleteResume)



export default router;