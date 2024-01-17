import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("database is connected");

})
.catch((err)=>{
    console.log(err);
})

app.listen(3005,()=>{
    console.log("server is listening to port 3005")
});

app.listen()