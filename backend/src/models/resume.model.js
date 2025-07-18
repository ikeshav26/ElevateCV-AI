import mongoose from 'mongoose';


const resumeSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    resumeUrl:{
        type: String,
    },
    isPublic:{
        type: Boolean,
        default: true
    }
})


const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;