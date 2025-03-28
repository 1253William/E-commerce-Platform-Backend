import express from "express";
const router = express.Router();
import { login, signup } from "../controllers/auth.controller";

//@route
//@desc
//@access
router.post('/auth/signup', signup);

//@route
//@desc
//@access
router.post('/auth/login', login);

export default router;