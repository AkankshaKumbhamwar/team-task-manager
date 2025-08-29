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
exports.taskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Project_1 = __importDefault(require("../models/Project"));
const Task_1 = __importDefault(require("../models/Task"));
const auth_1 = __importDefault(require("../middleware/auth"));
exports.taskRoutes = express_1.default.Router();
// Create task
exports.taskRoutes.post('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, assignee, dueDate, status, project } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const projectDoc = yield Project_1.default.findById(project);
        if (!projectDoc) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (!projectDoc.members.includes(req.user.id) && projectDoc.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only project members can create tasks' });
        }
        const task = new Task_1.default({
            title,
            description,
            assignee,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            status: status || 'To Do',
            project,
        });
        yield task.save();
        res.json(task);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Get tasks for a project
exports.taskRoutes.get('/:projectId', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (!project.members.includes(req.user.id) && project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only project members can view tasks' });
        }
        const tasks = yield Task_1.default.find({ project: req.params.projectId }).populate('assignee', 'name');
        res.json(tasks);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Update task
exports.taskRoutes.put('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, assignee, dueDate, status, project } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        const projectDoc = yield Project_1.default.findById(task.project);
        if (!projectDoc || (!projectDoc.members.includes(req.user.id) && projectDoc.owner.toString() !== req.user.id)) {
            return res.status(403).json({ msg: 'Only project members can update tasks' });
        }
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.assignee = assignee || task.assignee;
        task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
        task.status = status || task.status;
        task.project = project || task.project;
        yield task.save();
        res.json(task);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Delete task
exports.taskRoutes.delete('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        const project = yield Project_1.default.findById(task.project);
        if (!project || (!project.members.includes(req.user.id) && project.owner.toString() !== req.user.id)) {
            return res.status(403).json({ msg: 'Only project members can delete tasks' });
        }
        yield task.deleteOne();
        res.json({ msg: 'Task deleted' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
//# sourceMappingURL=tasks.js.map