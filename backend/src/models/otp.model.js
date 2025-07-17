import mongoose from 'mongoose';

const OtpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
        unique:true,
        minlength: 6,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 120 // OTP expires after 2 minutes
    }
})


const Otp=mongoose.model('Otp', OtpSchema);
export default Otp;