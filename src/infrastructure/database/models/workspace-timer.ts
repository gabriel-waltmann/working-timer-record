import mongoose, { Schema, Document } from 'mongoose';

export interface WorkspaceTimerDocument extends Document {
  id: number;
  workspace_id: number;
  start_time: Date;
  end_time?: Date;
}

const workspaceTimerSchema = new Schema({
  id: { type: Number, required: true },
  workspace_id: { type: Number, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: false },
});

export default mongoose.model<WorkspaceTimerDocument>('WorkspaceTimer', workspaceTimerSchema);