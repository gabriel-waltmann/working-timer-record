import mongoose, { Schema, Document } from "mongoose";

export interface WorkspaceDocument extends Document {
  id: number;
  name: string;
  price_by_hour: number;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Workspace:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        price_by_hour:
 *          type: number
 *      required:
 *        - id
 *        - name
 *        - price_by_hour
 *
 *    WorkspaceCreate:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        priceByHour:
 *          type: number
 *      required:
 *        - name
 *        - priceByHour
 *
 *    WorkspaceUpdate:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        price_by_hour:
 *          type: number
 *      required:
 *        - name
 *        - price_by_hour
 */
const workspaceSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price_by_hour: { type: Number, required: true }
});

export default mongoose.model<WorkspaceDocument>("Workspace", workspaceSchema);
