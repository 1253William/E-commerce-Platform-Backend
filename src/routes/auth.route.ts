import express from "express";
const router = express.Router();
import { login, logout, signup } from "../controllers/auth.controller";

//@route
//@desc
//@access
router.post('/auth/signup', signup);

//@route
//@desc
//@access
router.post('/auth/login', login);

//@route
//@desc
//@access
router.post('/auth/logout', logout)

export default router;