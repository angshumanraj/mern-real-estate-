import mongoose, { Schema } from "mongoose";


const userSchema=new Schema({
    username:{
    type:String,
    required:true,
    unique:true
    },
    password:{
        type:String,
        required:true,      
        },
    email:{
        type:String,
        required:true,
        unique:true
        },
        avatar:{
            type:String,
            default:"https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
        },
},{timestamps :true});


const User=mongoose.model('User',userSchema);

export default User;