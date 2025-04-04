import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => { 
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)

    if (!token){
        res.status(401).json({ success: false, message: "Access Denied: No token provided" });
        return;
    }

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
            if (err) {
                res.status(403).json({ success: false, message: "Forbidden: Invalid token or expired token" });
                return;
            }

            (req as any).user = user; 
            console.log(user);
            next();
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expire token" });
    }
}

