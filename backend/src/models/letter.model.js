import mongoose from 'mongoose';


const letterSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    jobTitle:{
        type:String,
        required:true,
    },
    company:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
    },
    skills:{
        type:Array,
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    experience:{
        type:String,
    },
    tone:{
        type:String,
        default:"Formal",
    },
    letterUrl:{
        type:String,
        required:true,
    }
})



const Letter=mongoose.model('Letter',letterSchema);
export default Letter;