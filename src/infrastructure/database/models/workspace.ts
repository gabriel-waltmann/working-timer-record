import mongoose, { Schema, Document } from 'mongoose';

export interface WorkspaceDocument extends Document {
  id: number;
  name: string;
  price_by_hour: number;
}

const workspaceSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price_by_hour: { type: Number, required: true },
});

export default mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);