import mongoose, { Schema, Document, Model } from 'mongoose';

interface IComment {
  text: string;
  user: mongoose.Types.ObjectId;
  date: Date;
}

interface ITask extends Document {
  title: string;
  description?: string;
  assignee?: mongoose.Types.ObjectId;
  dueDate?: Date;
  status: 'To Do' | 'In Progress' | 'Done';
  project: mongoose.Types.ObjectId;
  comments: IComment[];
}

const taskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true },
  description: String,
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  comments: [{ text: String, user: { type: Schema.Types.ObjectId, ref: 'User' }, date: { type: Date, default: Date.now } }]
});

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;