import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProject extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
}

const projectSchema: Schema<IProject> = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
export default Project;