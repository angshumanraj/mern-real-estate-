import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js'
import path  from 'path';
dotenv.config();  



mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("database is connected");

})
.catch((err)=>{
    console.log(err);
})

const _dirname=path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());


app.listen(3005,()=>{
    console.log("server is listening to port 3005")
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use(express.static(path.join(_dirname,'/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(_dirname,'client','dist','index.html'))
});

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