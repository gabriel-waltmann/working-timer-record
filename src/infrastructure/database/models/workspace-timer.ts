import mongoose, { Schema, Document } from 'mongoose';

export interface WorkspaceTimerDocument extends Document {
  id: number;
  workspace_id: number;
  start_time: Date;
  end_time?: Date;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    WorkspaceTimer:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        workspace_id:
 *          type: number
 *        start_time:
 *          type: string
 *        end_time:
 *          type: string
 *      required:
 *        - id
 *        - workspace_id
 *        - start_time
 * 
 *    WorkspaceTimerStart:
 *      type: object
 *      properties:
 *        workspaceId:
 *          type: number
 *      required:
 *        - workspaceId
 *      
 *    WorkspaceTimerEnd:
 *      type: object
 *      properties:
 *        workspaceId:
 *          type: number
 *      required:
 *        - workspaceId
 * 
 *    WorkspaceTimerExport:
 *      type: object
 *      properties:
 *        startDate:
 *          type: string
 *        endDate:
 *          type: string
 *        workspaceId:
 *          type: number
 *      required:
 *        - startDate
 *        - endDate
 *        - workspaceId
 *      example:
 *        startDate: 2024-09-01
 *        endDate: 2024-09-31
 *        workspaceId: 1727368941748
*/
const workspaceTimerSchema = new Schema({
  id: { type: Number, required: true },
  workspace_id: { type: Number, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: false },
});

export default mongoose.model<WorkspaceTimerDocument>('WorkspaceTimer', workspaceTimerSchema);