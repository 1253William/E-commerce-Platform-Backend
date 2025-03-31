import express from "express";
const router = express.Router();
import { getUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

//@route
//@desc
//@access
router.get('/user/profile', authMiddleware, getUserProfile);

//@route
//@desc
//@access
// router.post('/auth/login', login);

//@route
//@desc
//@access
// router.post('/auth/logout', logout)

export default router;