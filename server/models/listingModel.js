import mongoose, { Schema } from "mongoose";

const listingSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
        address:{
            type:String,
            require:true,
        },
        regularPrices:{
            type:Number,
            require:true,
        },
        bathrooms:{
            type:Number,
            require:true
        },
        discountPrices:{
            type:Number,
            require:true,
        },
        bedrooms:{
            type:Number,
            require:true
        },
        fernished:{
            type:Boolean,
            require:true,
        },
        offer:{
            type:Boolean,
            require:true,
        },
        imgUrls:{
            type:Array,
            require:true,
        },
        userRef:{
            type:String,
            require:true,
        },
    },{timestamps:true}
    
)

const Listing=mongoose.model('Listing',listingSchema);

export default Listing;