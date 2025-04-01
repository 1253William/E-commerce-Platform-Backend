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
                message: "Unauthorized: User not authenticated"
            });
            return;
        }

        const userEmail = req.user.email
        //Fetch User Profile
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, role, is_verified')
            .eq('email', userEmail)
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
            message: "User profile fetched successfully",
            data: user
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Unable to fetch user profile"
        });
    }
}

// @route PUT /api/user/profile/edit
// @description Update User Profile
// @access Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
            return;
        }

        const userEmail = req.user.email
        const { firstName, lastName } = req.body;
      
        if (!firstName && !lastName) { 
            res.status(400).json({
                success: false,
                message: "At least one field (first_name or last_name) is required to update"
            });
            return
        }

        //Update Data
        const updateData: { first_name?: string; last_name?: string } = {};
        if (firstName) updateData.first_name = firstName;
        if (lastName) updateData.last_name = lastName;

        //Update User Profile
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update({
                first_name: updateData.first_name,
                last_name: updateData.last_name
            })
            .eq('email', userEmail)
            .select('id, email, first_name, last_name')
            .single()
        
        if (error) {
            console.error("Supabase Query Error (Updating User Profile):", error);
            res.status(400).json({
                success: false,
                message: "Database Error: Error updating user profile",
                error: error.message
            });
            return
        }

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Error updating user profile", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Unable to update user profile"
        });
    }
}


// @route DELETE /api/user/profile
// @description Delete User Profile (Soft Delete)
// @access Private
export const deleteUserProfile = async (req: AuthRequest, res: Response): Promise<void> => { 

}

