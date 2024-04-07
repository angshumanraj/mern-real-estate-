import Listing from "../models/listingModel.js";
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

export const deleteUser=async(req,res,next)=>{
    
    
    if(req.user.id !== req.params.id) 
        return next(errorHandler(404,"You can only delete your own account"));

    try {
        await User.findOneAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error)
    }
};

export const getUserListing=async(req,res,next)=>{
    if(req.user.id === req.params.id){
        try {
            const listings=await Listing.find({userRef:req.params.id});
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    }else{
        return next(errorHandler(401,'you can only view your own listings!'))
    }
}

export const getUser=async (req,res,next)=>{
    const user =await  User.findById(req.params.id);

    if(!user) return next(errorHandler(404,'User Not Found'));

    const {password:pass,...rest}=user._doc;

    res.status(200).json(rest)
}