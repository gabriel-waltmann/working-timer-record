import WorkspaceTimerModel from '../database/models/workspace-timer';
import WorkspaceModel from '../database/models/workspace';
import { WorkspaceTimerRepository } from "../../domain/repositories/workspace-timer-repository";
import { EndTimerUseCase } from '../../application/use-cases/workspace-timer/end-timer-use-case';

import workspaceTimerQueue from "../queue/workspace-timer-queue";
import { WorkspaceTimer, WorkspaceTimerStatus } from '../../domain/entities/workspace-timer';
import exceljs from 'exceljs';

export class MongoWorkspaceTimerRepository implements WorkspaceTimerRepository {
  async create(workspaceId: number, start: Date, end: Date): Promise<WorkspaceTimer | null> {
    const id = String(Date.now());

    try {
      const workspaceTimer = new WorkspaceTimerModel({
        id,
        workspace_id: workspaceId,
        start_time: start,
        end_time: end,
      });

      await workspaceTimer.save();

      return workspaceTimer as WorkspaceTimer;
    } catch (error) {
      console.error('Error saving timer to MongoDB:', error);
      return null;
    }
  }

  async start(workspaceId: number): Promise<WorkspaceTimer | null> {
    const workspaceTimerId = String(Date.now());
    const startTime = new Date();

    async function handleTimerExpiration(workspaceTimerId: number): Promise<void> {
      const workspaceTimerRepository = new MongoWorkspaceTimerRepository();
    
      const endTimerUseCase = new EndTimerUseCase(workspaceTimerRepository);
    
      await endTimerUseCase.execute(workspaceTimerId);
    }

    try {
      const workspace = await WorkspaceModel.findOne({ id: workspaceId });

      if (!workspace) return null;

      // ! Save the timer in MongoDB
      const workspaceTimer = new WorkspaceTimerModel({
        id: workspaceTimerId,
        workspace_id: workspaceId,
        start_time: startTime,
      });
      await workspaceTimer.save();

      // ! Save the timer in Redis
      const delay = 14400000; // ! 4 hours => 4 * 60 * 60 * 1000 = 14400000 milliseconds
      await workspaceTimerQueue.add(
        workspaceTimerId,
        { message: 'Timer expired' },
        { delay, jobId: workspaceTimerId }
      );

      workspaceTimerQueue.process(workspaceTimerId, async ({ id }) => {
        console.info('Stopping workspace timer:', id);
        
        await handleTimerExpiration(parseInt(workspaceTimerId));
      });

      return workspaceTimer as WorkspaceTimer;
    } catch (error) {
      console.error('Error saving timer to MongoDB:', error);

      return null;
    }
  }

  async end(workspaceTimerId: number): Promise<WorkspaceTimer | null> {    
    try {
      // ! Get the timer from Redis
      const workspaceTimerJob = await workspaceTimerQueue.getJob(workspaceTimerId);

      // ! Remove the timer from Redis
      if (workspaceTimerJob && !workspaceTimerJob.processedOn) {        
        await workspaceTimerJob.remove(); 
      }

      // ! Update the timer in MongoDB
      const endTime = new Date();
      const workspaceTimer = await WorkspaceTimerModel.findOneAndUpdate(
        { id: workspaceTimerId },
        { end_time: endTime },
        { new: true }
      );

      return workspaceTimer ? workspaceTimer as WorkspaceTimer : null;
    } catch (error) {
      console.error('Error saving timer to MongoDB:', error);
      return null;
    }
  }

  async retrievesOne(workspaceTimerId: number): Promise<WorkspaceTimer | null> {
    const timerRecord = await WorkspaceTimerModel.findOne({ id: workspaceTimerId });

    if (!timerRecord) {
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

    // ! Get the timer from Redis
    const workspaceTimerJob = await workspaceTimerQueue.getJob(workspaceTimerId);

    // ! Remove the timer from Redis
    if (workspaceTimerJob && !workspaceTimerJob.processedOn) {        
      await workspaceTimerJob.remove(); 
    }

    return !!deleted;
  }

  async export (startDateStr: string, endDateStr: string, workspaceId: number): Promise<exceljs.Workbook | null> {
    const startTime = new Date(startDateStr);
    const endTime = new Date(endDateStr);

    const workspace = await WorkspaceModel.findOne({ id: workspaceId });

    if (!workspace) return null;

    // ! has valid startDate endDate and is between startTime and endTime
    const workspaceTimers = await WorkspaceTimerModel.find({
      workspace_id: workspaceId,
      start_time: { $gte: startTime, $lte: endTime },
    });

    type TSheetContent = {
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
    }

    const sheetContent = (): TSheetContent[] => {
      return workspaceTimers.map((workspaceTimer) => {
        const startDate = new Date(workspaceTimer.start_time); //  YYYY-MM-DD
        const endDate = workspaceTimer.end_time ? new Date(workspaceTimer.end_time) : new Date(); //  YYYY-MM-DD

        const date = startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); //  DD/MM/YYYY
        const startTime = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); //  HH:MM:SS
        const endTime = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); //  HH:MM:SS
        const durationCalc = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60; //  HH:MM:SS
        const duration = +durationCalc.toFixed(2); //  HH:MM:SS

        return {
          date,
          startTime,
          endTime,
          duration,
        };
      });
    };

    const workbook = new exceljs.Workbook();

    const sheet = workbook.addWorksheet(workspace.name);
    sheet.columns = [
      { header: 'Data', key: 'date', width: 16 },
      { header: 'Hora de início', key: 'startTime', width: 16 },
      { header: 'Hora de término', key: 'endTime', width: 16 },
      { header: 'Duração (horas)', key: 'duration', width: 16 },
    ];

    sheet.addRows(sheetContent());
    
    return workbook;
  }
}