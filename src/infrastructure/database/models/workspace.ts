import mongoose, { Schema, Document } from 'mongoose';

export interface WorkspaceDocument extends Document {
  id: number;
  name: string;
}

const workspaceSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);