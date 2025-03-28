"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
require('dotenv').config();
// @route POST /api/auth/signup
// @description Sign Up User (Create User and Hashed Password)
// @access Public
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, role, isVerified } = req.body;
        //Validation
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }
        //Check for existing user
        const { data: existingUser, error: userError } = yield db_1.default
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
            return;
        }
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            });
            return;
        }
        //Hash Password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        //Create New User
        const { error } = yield db_1.default
            .from('users')
            .insert([{
                email,
                first_name: firstName,
                last_name: lastName,
                password: hashedPassword,
                role,
                is_verified: isVerified
            }]);
        if (error) {
            res.status(400).json({
                success: false,
                message: "Error in creating user"
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    }
    catch (error) {
        console.log({ message: "Error signing up user", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
});
exports.signup = signup;
// @route POST /api/auth/login
// @description Login User (JWT authentication with refresh and access token )
// @access Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }
        //Check for existing user
        const { data: existingUser, error: userError } = yield db_1.default
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
            return;
        }
        if (!existingUser) {
            res.status(400).json({
                success: false,
                message: "User not found, Please sign up"
            });
            return;
        }
        //Check Password
        const validPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        //Create JWT Token
        const accessToken = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ email: existingUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        //Use Refresh Token
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.log({ message: "Error logging in user", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
});
exports.login = login;
