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
            .select('email')
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
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            });
            return
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
                is_verified: isVerified ?? false
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
        const accessToken = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
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