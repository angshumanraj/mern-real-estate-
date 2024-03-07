import express from 'express';
import { google, signin, signup,signOut } from '../controllers/authController.js';

const router=express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get('/signout',signOut);

export default  router;