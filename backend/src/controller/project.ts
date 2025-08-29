import express, { Router, Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import auth from '../middleware/auth';
import { JWT_SECRET } from '../utils/envConfig';
import mongoose from 'mongoose';
import User from '../models/User';

export const projectRoutes: Router = express.Router();

// Interface for project body
interface ProjectBody {
  name: string;
  members?: string[]; // Array of user IDs
}

// Interface for auth request
interface AuthRequest extends Request {
  user?: { id: string };
}

// Get all users
projectRoutes.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('_id name email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create project
projectRoutes.post('/', auth, async (req: AuthRequest, res: Response) => {
  const { name, members } = req.body as ProjectBody;
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const project = new Project({
      name,
      members: members ? [...new Set([...members, req.user.id])] : [req.user.id],
      owner: req.user.id,
    });

    await project.save();
    res.json(project);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's projects
projectRoutes.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).populate('members', 'name email');
    res.json(projects);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update project
projectRoutes.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  const { name, members }:any = req.body as ProjectBody;
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only project owner can update' });
    }

    project.name = name || project.name;
    if (members) {
      project.members = [...new Set([...members, req.user.id])] as mongoose.Types.ObjectId[];
    }

    await project.save();
    res.json(project);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete project
projectRoutes.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only project owner can delete' });
    }

    await Task.deleteMany({ project: project.id }); // Delete associated tasks
    await project.deleteOne();
    res.json({ msg: 'Project deleted' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
