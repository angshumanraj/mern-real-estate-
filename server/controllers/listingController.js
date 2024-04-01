import Listing from "../models/listingModel.js"
import { errorHandler } from "../utils/error.js";


export const createListing = async(req,res,next)=>{
    try {
        const listing=await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
};