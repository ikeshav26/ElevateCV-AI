import express from "express";
import { generate, getAllResumes, getResume } from "../controller/resume.controller.js";
import { userAuth } from "../middlewares/user.auth.js";


const router=express.Router();


router.post('/generate',userAuth,generate)
router.get('/all',userAuth,getAllResumes)
router.get('/:id',userAuth,getResume)


export default router;