import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.routes.js';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

const PORT = process.env.PORT;


app.get('/', (req, res) => {
  res.send('create your cv now');
});



app.use('/api/user',userRoutes)



app.listen(PORT, () => {  console.log(`Server is running on port ${PORT}`);
});