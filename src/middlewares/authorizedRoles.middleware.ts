import { Request, Response, NextFunction } from 'express';
//RBAC specific middleware
//Roles : Admin, User
export const authorizedRoles = (...roles: string[]) => { 
    return (req: Request, res: Response, next: NextFunction) => { 
        const user = (req as any).user;

        if(!roles.includes(user.role)){
            return res.status(403).json({success: false, message: "Forbidden: You are not authorized to access this resource"});
        }
        next();
    }
}