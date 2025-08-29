import express, { Router, Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import auth from '../middleware/auth';

export const taskRoutes: Router = express.Router();

// Interface for task body
interface TaskBody {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    status?: 'To Do' | 'In Progress' | 'Done';
    project: string;
}

// Interface for auth request
interface AuthRequest extends Request {
    user?: { id: string };
}

// Create task
taskRoutes.post('/', auth, async (req: AuthRequest, res: Response) => {
    const { title, description, assignee, dueDate, status, project } = req.body as TaskBody;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (!projectDoc.members.includes(req.user.id as any) && projectDoc.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only project members can create tasks' });
        }

        const task = new Task({
            title,
            description,
            assignee,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            status: status || 'To Do',
            project,
        });

        await task.save();
        res.json(task);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get tasks for a project
taskRoutes.get('/:projectId', auth, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (!project.members.includes(req.user.id as any) && project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only project members can view tasks' });
        }

        const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name');
        res.json(tasks);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update task
taskRoutes.put('/:id', auth, async (req: AuthRequest, res: Response) => {
    const { title, description, assignee, dueDate, status, project } = req.body as TaskBody;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const task: any = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        const projectDoc = await Project.findById(task.project);
        if (!projectDoc || (!projectDoc.members.includes(req.user.id as any) && projectDoc.owner.toString() !== req.user.id)) {
            return res.status(403).json({ msg: 'Only project members can update tasks' });
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.assignee = assignee || task.assignee;
        task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
        task.status = status || task.status;
        task.project = project || task.project;

        await task.save();
        res.json(task);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete task
taskRoutes.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project || (!project.members.includes(req.user.id as any) && project.owner.toString() !== req.user.id)) {
            return res.status(403).json({ msg: 'Only project members can delete tasks' });
        }

        await task.deleteOne();
        res.json({ msg: 'Task deleted' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

