import express from "express";
const router = express.Router();
import { getUserProfile, updateUserProfile, deleteUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

//@route
//@desc
//@access
router.get('/user/profile', authMiddleware, getUserProfile);

//@route
//@desc
//@access
router.put('/user/profile/edit', authMiddleware, updateUserProfile);

//@route
//@desc
//@access
router.delete('/user/profile/discard', authMiddleware, deleteUserProfile);

export default router;