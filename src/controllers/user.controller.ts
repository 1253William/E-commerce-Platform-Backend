import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import supabase from '../config/db'
require('dotenv').config();

// @route GET /api/user/profile
// @description Fetch User Profile
// @access Private
interface AuthRequest extends Request {
    user?: { email: string }; 
}

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => { 
    try {

        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
            return;
        }

        const userId = req.user.email
        //Fetch User Profile
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, role, is_verified')
            .eq('email', userId)
            .single();
        if (error) {
            console.error("Supabase Query Error (Fetching User Profile):", error);
            res.status(400).json({
                success: false,
                message: "Database Error: Error fetching user profile",
                error: error.message
            });
            return
        }
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Unable to get user profile"
        });
    }
}

// @route PUT /api/user/profile
// @description Update User Profile
// @access Private

// @route DELETE /api/user/profile
// @description Delete User Profile (Soft Delete)
// @access Private

