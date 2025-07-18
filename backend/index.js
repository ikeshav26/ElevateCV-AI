import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.routes.js';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import qnaRoutes from './src/routes/QNA.routes.js';
import resumeRoutes from './src/routes/resume.routes.js'
import letterRoutes from './src/routes/letter.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());

// Increase request size limit for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB();

const PORT = process.env.PORT;


app.get('/', (req, res) => {
  res.send('create your cv now');
});



app.use('/api/user',userRoutes)
app.use('/api/resume',resumeRoutes)
app.use('/api/qna',qnaRoutes)
app.use('/api/letter',letterRoutes)



app.listen(PORT, () => {  console.log(`Server is running on port ${PORT}`);
});