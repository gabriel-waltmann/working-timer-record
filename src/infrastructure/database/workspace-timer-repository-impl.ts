import WorkspaceTimerModel from '../database/models/workspace-timer';
import WorkspaceModel from '../database/models/workspace';
import { WorkspaceTimerRepository } from "../../domain/repositories/workspace-timer-repository";

import redisClient from "../redis/redisClient";
import { WorkspaceTimer, WorkspaceTimerStatus } from '../../domain/entities/workspace-timer';

export class MongoWorkspaceTimerRepository implements WorkspaceTimerRepository {
  async start(workspaceId: number): Promise<WorkspaceTimer | null> {
    const workspaceTimerId = Date.now();
    const startTime = new Date();

    try {
      const workspace = await WorkspaceModel.findOne({ id: workspaceId });

      if (!workspace) {
        console.log(`Workspace with ID ${workspaceId} not found.`);
        return null;
      }

      // ! Save the timer to MongoDB
      const workspaceTimer = new WorkspaceTimerModel({
        id: workspaceTimerId,
        workspace_id: workspaceId,
        start_time: startTime,
      });
      await workspaceTimer.save();

      // ! Save the timer in Redis
      const workspaceTimerKey = `timer:${workspaceTimerId}`;
      const workspaceTimerStr = String(workspaceTimerId);
      const workspaceTimerMaxSeconds = 14400; // ! 4 hours => 14400 seconds
      await redisClient.set(workspaceTimerKey, workspaceTimerStr);

      // ! Set Redis expiration 
      await redisClient.expire(workspaceTimerKey, workspaceTimerMaxSeconds);

      console.log(`Timer ${workspaceTimerId} started.`);

      return workspaceTimer as WorkspaceTimer;
    } catch (error) {
      console.error('Error saving timer to MongoDB:', error);

      return null;
    }
  }

  async end(workspaceTimerId: number): Promise<WorkspaceTimer | null> {    
    try {
      // ! Retrieve the timer from Redis
      const workspaceTimerKey = `timer:${workspaceTimerId}`;
      const workspaceTimerStr = await redisClient.get(workspaceTimerKey);
      if (workspaceTimerStr) {
        // Remove the timer from Redis
        await redisClient.del(workspaceTimerKey);
      }
  
      const endTime = new Date();
  
      // Update the timer record to MongoDB
      const workspaceTimer = await WorkspaceTimerModel.findOneAndUpdate(
        { id: workspaceTimerId },
        { end_time: endTime },
        { new: true }
      );

      return workspaceTimer as WorkspaceTimer;
    } catch (error) {
      console.error('Error saving timer to MongoDB:', error);
      return null;
    }
  }

  async retrievesOne(workspaceTimerId: number): Promise<WorkspaceTimer | null> {
    const timerRecord = await WorkspaceTimerModel.findOne({ id: workspaceTimerId });

    if (!timerRecord) {
      const workspaceTimerKey = `timer:${workspaceTimerId}`;

      const workspaceTimerStr = await redisClient.get(workspaceTimerKey);

      if (workspaceTimerStr) {
        const workspaceTimer = JSON.parse(workspaceTimerStr);

        return workspaceTimer;
      }

      return null;
    }

    return timerRecord as WorkspaceTimer;
  }

  async retrieves(status?: WorkspaceTimerStatus): Promise<WorkspaceTimer[]> {
    let workspaceTimers = [];

    const getStarted = async () => await WorkspaceTimerModel.find({ end_time: { $exists: false } });

    const getEnded = async () => await WorkspaceTimerModel.find({ end_time: { $exists: true }});

    switch (status) {
      case WorkspaceTimerStatus.RUNNING:
        workspaceTimers = await getStarted();
        break;
    
      case WorkspaceTimerStatus.ENDED:
        workspaceTimers = await getEnded();
        break;
      default:
        workspaceTimers = await getStarted();
        workspaceTimers = workspaceTimers.concat(await getEnded());
        break;
    }

    return workspaceTimers as WorkspaceTimer[];
  }

  async delete(workspaceTimerId: number): Promise<boolean> {
    const deleted = await WorkspaceTimerModel.deleteOne({ id: workspaceTimerId });

    return !!deleted;
  }
}