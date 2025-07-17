import express from 'express';
import { changeUsername, login, logout, resetPassword, sendOtp, setAvatar, signup } from '../controller/user.controller.js';
import {userAuth} from '../middlewares/user.auth.js'
import dotenv from 'dotenv';
dotenv.config();

const router=express.Router();


router.post('/signup',signup);
router.post('/login',login)
router.get('/logout',logout)
router.post('/send-otp',sendOtp)
router.post('/verify-otp',resetPassword)
router.post('/add-avatar',userAuth,setAvatar)
router.post('/change-username',userAuth,changeUsername)




export default router;