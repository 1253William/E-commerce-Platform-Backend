"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const rootRouter = express_1.default.Router();
rootRouter.get("/", (req, res) => {
    res.send("API Health Check is running...");
    console.log("API Health Check is running...");
});
rootRouter.use(auth_route_1.default);
exports.default = rootRouter;
