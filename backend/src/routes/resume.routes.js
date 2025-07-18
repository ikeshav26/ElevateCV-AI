import express from "express";
import { generate } from "../controller/resume.controller.js";
import { userAuth } from "../middlewares/user.auth.js";


const router=express.Router();


router.post('/generate',userAuth,generate)



export default router;