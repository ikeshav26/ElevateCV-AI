import mongoose from 'mongoose';


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type:String,
        default:"https://res.cloudinary.com/ducvkar80/image/upload/v1752432217/avatars/b8hmel53wxf4hhywhpy5.jpg"
    }
})

const User=mongoose.model('User',userSchema);
export default User;