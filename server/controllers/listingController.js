import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async(req,res,next)=>{

    try {
        const listing=await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}; 

export const deleteListing=async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found!'))
    }     

    if(req.user.id!==listing.userRef){
        return next(errorHandler(401,'You can delete your own listing'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing is deleted")
    } catch (error) {
        next(error)
    } 
}

export const updateListing=async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id);
    
    if(!listing){
        return next(errorHandler(404,'No Listing Found'))
    }
    if(req.user.id!== listing.userRef){
        return next(errorHandler(401,'You can only update your owen listings!!'))
    }
    try {
        const updatedListing=await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new :true }
        );
        res.status(200).json(updatedListing);

    } catch (error) {

        next(error)

    }
};

export const getListing = async (req, res, next) => {
    const listingId = req.params.id;
    console.log(listingId)
    if (!listingId) {
        return next(errorHandler(400, 'Listing ID is missing.'));
    }

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        console.log(error);
        next(error);
    }
};


export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = {$in: [false, true]};
        }
        
        let furnished = req.query.furnished;

        if (furnished === 'undefined' || furnished === 'false') {
            furnished = {$in: [false, true]};
        }

        let parking = req.query.parking;

        if (parking === 'undefined' || parking === 'false') {
            parking = {$in: [false, true]};
        }

        let type = req.query.type;

        if (type === 'undefined' || type === 'all') {
            type = {$in: ['sale', 'rent']};
        }

        const searchTerm = req.query.searchTerm || '';
        const sorted = req.query.sorted || 'createdAt';
        const order = req.query.order || 'desc';

        // Construct the query object
        const query = {
            name: {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
        };

        // Add type to the query only if it's defined
        if (type !== undefined) {
            query.type = type;
        }

        const listings = await Listing
            .find(query)                              
            .sort({[sorted]: order})
            .limit(limit)
            .skip(startIndex);
            
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
