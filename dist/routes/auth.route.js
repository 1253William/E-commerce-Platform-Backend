"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../controllers/auth.controller");
//@route
//@desc
//@access
router.post('/auth/signup', auth_controller_1.signup);
//@route
//@desc
//@access
router.post('/auth/login', auth_controller_1.login);
exports.default = router;
