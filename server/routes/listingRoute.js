import express from "express";
import { createListing } from "../controllers/listingController.js";
import {verifyUser} from "../utils/verifyUser.js"
import { deleteListing } from "../controllers/userController.js";

const router= express.Router();

router.post('/create',verifyUser,createListing);
router.delete('/delete/:id', verifyUser, deleteListing);

export default router;