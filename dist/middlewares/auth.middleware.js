"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    console.log(req.headers);
    if (!token)
        return res.status(401).json({ message: "Access Denied" });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Invalid or expire token" });
    }
};
exports.authMiddleware = authMiddleware;
