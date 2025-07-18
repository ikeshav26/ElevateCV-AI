import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import OTP from '../models/otp.model.js';
import cloudinary from '../config/cloudinary.js'



export const signup=async(req,res)=>{
    try{
        const {username,email,password}=req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            username:username,
            email:email,
            password:hashedPassword
        })
        await newUser.save();

        const token=jwt.sign({user:newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(201).json({message: 'User created successfully', user: newUser, token});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const isPasswordValid=await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token=jwt.sign({user:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(200).json({message: 'Login successful', user, token});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}



export const logout=(req,res)=>{
    try{
        res.clearCookie('token', {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(200).json({message: 'Logout successful'});   
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const sendOtp=async(req,res)=>{
    try{
        const {email}=req.body;

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        const Otp=Math.floor(100000 + Math.random() * 900000).toString();
        const otpEntry=new OTP({
            email: email,
            otp: Otp
        });
        await otpEntry.save();

        const auth=nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const receiver={
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset',
            text:"Your password reset otp :"+Otp
        }

        await auth.sendMail(receiver, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }
            console.log('Email sent: ' + info.response);
        });
        res.status(200).json({message: 'OTP sent successfully', otp: Otp});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}



export const resetPassword=async(req,res)=>{
    try{
        const {email,otp,newPassword}=req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({message: 'All fields are required'});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        const otpEntry=await OTP.findOne({email, otp});
        if(!otpEntry){
            return res.status(400).json({message: 'Invalid OTP'});
        }

        const hashedPassword=await bcrypt.hash(newPassword, 10);
        user.password=hashedPassword;
        await user.save();

        await OTP.deleteOne({email, otp});
        res.status(200).json({message: 'Password reset successful'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const setAvatar=async(req,res)=>{
    try{
        const {avatar}=req.body;
        const userId=req.user;
        console.log('User ID:', userId);
        
        if(!avatar){
            return res.status(400).json({message: 'Avatar is required'});
        }

        // Validate base64 format
        if(!avatar.startsWith('data:image/')) {
            return res.status(400).json({message: 'Invalid image format. Please provide a valid base64 image.'});
        }

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        // Enhanced Cloudinary upload with better error handling
        const result=await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
            height: 150,
            crop: 'fill',
            format: 'jpg',
            quality: 'auto',
            resource_type: 'image'
        });

        console.log('Cloudinary upload result:', result);
        
        user.avatar=result.secure_url;
        await user.save();
        
        res.status(200).json({
            message: 'Avatar set successfully', 
            avatar: user.avatar,
            cloudinaryId: result.public_id
        });
    }catch(err){
        console.error('Avatar upload error:', err);
        
        // Handle specific Cloudinary errors
        if(err.error && err.error.message) {
            return res.status(400).json({
                message: 'Cloudinary upload failed', 
                error: err.error.message
            });
        }
        
        // Handle other errors
        res.status(500).json({
            message: 'Internal server error', 
            error: err.message || 'Unknown error occurred'
        });
    }
}


export const changeUsername=async(req,res)=>{
    try{
        const {newUsername}=req.body;
        const userId=req.user;

        if(!newUsername){
            return res.status(400).json({message: 'New username is required'});
        }

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        user.username=newUsername;
        await user.save();

        res.status(200).json({message: 'Username updated successfully', username: user.username});
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Internal server error', 
            error: err.message || 'Unknown error occurred'
        });
    }
}



export const LoggedInUSer=async(req,res)=>{
    try{
        const userId=req.user;
        if(!userId){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User retrieved successfully', user});
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Internal server error', 
            error: err.message || 'Unknown error occurred'
        });
    }
}