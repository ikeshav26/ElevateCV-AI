import express from 'express';
import { login, logout, resetPassword, sendOtp, signup } from '../controller/user.controller.js';

const router=express.Router();


router.post('/signup',signup);
router.post('/login',login)
router.get('/logout',logout)
router.post('/send-otp',sendOtp)
router.post('/verify-otp',resetPassword)




export default router;