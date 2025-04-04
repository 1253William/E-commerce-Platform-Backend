import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import supabase from '../config/db'
require('dotenv').config();

// @route POST /api/auth/signup
// @description Sign Up User (Create User and Hashed Password)
// @access Public
export const signup = async ( req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role, isVerified } = req.body;
        //Validation
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return 
        }

        //Check for existing user
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id, email, is_account_deleted')
            .eq('email', email)
            .maybeSingle();
        if (userError) { 
             console.error("Supabase Query Error (Checking User):", userError);
            res.status(400).json({
                success: false,
                message: "Database Error: Error in signin up user",
                error: userError.message, 
            });
            return
        }

          if (existingUser) {
            if (existingUser.is_account_deleted) {
                // Restore soft-deleted user
                const { error: restoreError } = await supabase
                    .from('users')
                    .update({
                        is_account_deleted: false,
                        deleted_at: null,
                        password: await bcrypt.hash(password, 10), // Update password
                        first_name: firstName,
                        last_name: lastName,
                        role: role || 'User',
                        is_verified: isVerified ?? false
                    })
                    .eq('id', existingUser.id);

                if (restoreError) {
                    console.error("Supabase Query Error (Restoring User):", restoreError);
                    res.status(400).json({
                        success: false,
                        message: "Database Error: Error restoring user",
                        error: restoreError.message
                    });
                    return;
                }

                res.status(200).json({
                    success: true,
                    message: "User account restored successfully"
                });
                return;
            }

            res.status(400).json({
                success: false,
                message: "User already exists"
            });
            return;
        }
        
        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create New User
        const { error } = await supabase
            .from('users')
            .insert([{
                email,
                first_name: firstName,
                last_name: lastName,
                password: hashedPassword,
                role: role || 'User',
                is_verified: isVerified ?? false,
                is_account_deleted: false,
                deleted_at: null
            }])
        if (error) {
             res.status(400).json({
                success: false,
                message: "Error in creating user"
             });
            return
        }

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error: unknown) {
        console.log({message: "Error signing up user", error: error});
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return 
    }
 }


// @route POST /api/auth/login
// @description Login User (JWT authentication with refresh and access token )
// @access Public
export const login = async (req: Request, res: Response): Promise<void> => { 
    try {
        const { email, password } = req.body;

        //Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return
        }

        //Check for existing user
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();
        if (userError) {
            console.error("Supabase Query Error (Checking User):", userError);
            res.status(400).json({
                success: false,
                message: "Database Error: Error in checking user",
                error: userError.message,
            });
            return
        }

        if (!existingUser) {
            res.status(400).json({
                success: false,
                message: "User not found, Please sign up"
            });
            return
        }

        if (existingUser.is_account_deleted) {
            res.status(404).json({
                success: false,
                message: "Account has been deleted, please sign up again."
            });
            return;
         }  

        //Check Password
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return
        }

        //Create JWT Token
        const accessToken = jwt.sign({ userId: existingUser.id, email: existingUser.email, role: existingUser.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email: existingUser.email }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
        
        //Use Refresh Token
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
            refreshToken
        });

    } catch (error: unknown) {
        console.log({ message: "Error logging in user", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return
    }
}


// @route POST /api/auth/logout 
// @description Logout User (Clear refresh token)
// @access Public
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({success:true, message: "User logged out successfully"})
        
    } catch (error) {
        console.error({ message: "Error logging out user", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}


// @route POST /api/auth/refresh-token
// @description Generate access token using refresh token 
// @access Public
export const refreshToken = async (req: Request, res: Response): Promise<void> => { 
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No refresh token"
            });
            return
        }

        
        
        // Verify the refresh token
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                res.clearCookie('refreshToken');
                res.status(403).json({ success: false, message: "Session expired, please log in again" });
                return;
            }
            
            // Generate a new access token
            const newAccessToken = jwt.sign(
                { email: decoded.email },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "15m" }
            );

            res.status(200).json({
                success: true,
                accessToken: newAccessToken,
            });
        });

    } catch (error: unknown) {
        console.log({ message: "Error generating access token", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return
    }
}