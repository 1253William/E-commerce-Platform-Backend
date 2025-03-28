import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => { 
    const token = req.headers.authorization?.split(" ")[1];
    console.log(req.headers)
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid or expire token" });
    }
}
