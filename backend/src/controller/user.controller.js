import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';


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

        const token=jwt.sign({user:newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(201).json({message: 'User created successfully', user: newUser, token});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

