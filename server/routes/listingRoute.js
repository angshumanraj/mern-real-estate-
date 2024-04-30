import express from "express";
import { createListing, getListings,deleteListing, getListing, updateListing} from "../controllers/listingController.js";
import {verifyUser} from "../utils/verifyUser.js"


const router= express.Router();

router.post('/create',verifyUser,createListing);
router.delete('/delete/:id', verifyUser,deleteListing);
router.post('/update/:id',verifyUser,updateListing);
router.get('/get/:id',getListing);
router.get('/get',getListings);

export default router;