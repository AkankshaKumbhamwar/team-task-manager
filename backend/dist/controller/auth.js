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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const envConfig_1 = require("../utils/envConfig");
dotenv_1.default.config();
exports.authRouter = express_1.default.Router();
// Sign up
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user)
            return res.status(400).json({ msg: 'User already exists' });
        user = new User_1.default({ email, password, name });
        yield user.save();
        const payload = { user: { id: user.id } };
        jsonwebtoken_1.default.sign(payload, `${envConfig_1.JWT_SECRET}`, { expiresIn: '1h' }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        res.status(500).send('Server error');
    }
}));
// Login 
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id } };
        jsonwebtoken_1.default.sign(payload, `${envConfig_1.JWT_SECRET}`, { expiresIn: '1h' }, (err, token) => {
            if (err)
                throw err;
            res.status(200).json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Logout
exports.authRouter.post('/logout', (req, res) => {
    res.json({ msg: 'Logged out successfully' });
});
//# sourceMappingURL=auth.js.map