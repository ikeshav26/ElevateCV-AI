import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    }catch(err){
        console.error('Database connection failed:', err);
        process.exit(1); 
    }
}

export default connectDB;