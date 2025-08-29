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
exports.projectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Project_1 = __importDefault(require("../models/Project"));
const Task_1 = __importDefault(require("../models/Task"));
const auth_1 = __importDefault(require("../middleware/auth"));
const User_1 = __importDefault(require("../models/User"));
exports.projectRoutes = express_1.default.Router();
// Get all users
exports.projectRoutes.get('/users', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select('_id name email');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}));
// Create project
exports.projectRoutes.post('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, members } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const project = new Project_1.default({
            name,
            members: members ? [...new Set([...members, req.user.id])] : [req.user.id],
            owner: req.user.id,
        });
        yield project.save();
        res.json(project);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Get user's projects
exports.projectRoutes.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const projects = yield Project_1.default.find({
            $or: [{ owner: req.user.id }, { members: req.user.id }],
        }).populate('members', 'name email');
        res.json(projects);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Update project
exports.projectRoutes.put('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, members } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const project = yield Project_1.default.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only project owner can update' });
        }
        project.name = name || project.name;
        if (members) {
            project.members = [...new Set([...members, req.user.id])];
        }
        yield project.save();
        res.json(project);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Delete project
exports.projectRoutes.delete('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const project = yield Project_1.default.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only project owner can delete' });
        }
        yield Task_1.default.deleteMany({ project: project.id }); // Delete associated tasks
        yield project.deleteOne();
        res.json({ msg: 'Project deleted' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
//# sourceMappingURL=project.js.map