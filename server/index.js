import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';

dotenv.config();  

const app = express();


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("database is connected");

})
.catch((err)=>{
    console.log(err);
})
app.use(express.json())

app.listen(3005,()=>{
    console.log("server is listening to port 3005")
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);


//middleware
// Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
