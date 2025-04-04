import express from "express";
const router = express.Router();

import { getUserProfile, updateUserProfile, deleteUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware";

// @route   GET /user/profile
// @desc    Fetch user profile
// @access  Private (Admin, User
// Ticket: Problem with identifying user with role = User, so check permissions or middleware
router.get('/user/profile', authMiddleware, authorizedRoles( "Admin", "User"), getUserProfile);

// @route
// @desc
// @access
router.put('/user/profile/edit', authMiddleware,authorizedRoles("Admin", "User"), updateUserProfile);

// @route
// @desc
// @access
router.delete('/user/profile/discard', authMiddleware, authorizedRoles("Admin", "User"), deleteUserProfile);


export default router;