"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../utils/envConfig");
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, `${envConfig_1.JWT_SECRET}`);
        req.user = decoded.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map