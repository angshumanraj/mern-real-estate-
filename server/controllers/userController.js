import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";



export const test=(req,res)=>{
    res.json({
        message:"Api route is working"
    });
};

export const updateUser=async(req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,"login with your own account"))
    } 

    try {
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }
        const updateUser=await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar
            },
        },{new:true}
        );
        if (!updateUser) {
            return next(errorHandler(404, "User not found"));
        }

        const {password,...rest}=updateUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

};
