import express from "express";
const router = express.Router();
import { refreshToken } from "../controllers/auth.controller";

//@route
//@desc
//@access
router.post('/auth/refresh-token', refreshToken);



export default router;