import WorkspaceTimerModel from "../database/models/workspace-timer";
import WorkspaceModel from "../database/models/workspace";
import { WorkspaceTimerRepository } from "../../domain/repositories/workspace-timer-repository";
// import workspaceTimerQueue from "../queue/workspace-timer-queue";

import {
  WorkspaceTimer,
  WorkspaceTimerStatus
} from "../../domain/entities/workspace-timer";
import exceljs from "exceljs";

export class MongoWorkspaceTimerRepository implements WorkspaceTimerRepository {
  async create(
    workspace_id: number,
    start_time?: string,
    end_time?: string
  ): Promise<WorkspaceTimer | null> {
    const id = String(Date.now());

    try {
      const workspaceTimer = new WorkspaceTimerModel({
        id,
        workspace_id,
        start_time,
        end_time
      });

      await workspaceTimer.save();

      return workspaceTimer as WorkspaceTimer;
    } catch (error) {
      console.error("Error saving timer to MongoDB:", error);
      return null;
    }
  }

  async update(
    workspace_timer_id: number,
    workspace_id?: number,
    start_time?: string,
    end_time?: string
  ): Promise<WorkspaceTimer | null> {
    try {
      const workspaceTimer = await WorkspaceTimerModel.findOneAndUpdate(
        { id: workspace_timer_id },
        { workspace_id, start_time, end_time },
        { new: true }
      );

      if (!workspaceTimer) {
        return null;
      }

      return workspaceTimer as WorkspaceTimer;
    } catch (error) {
      console.error("Error updating timer in MongoDB:", error);
      return null;
    }
  }

  async retrievesOne(workspaceTimerId: number): Promise<WorkspaceTimer | null> {
    const timerRecord = await WorkspaceTimerModel.findOne({
      id: workspaceTimerId
    });

    if (!timerRecord) {
      return null;
    }

    return timerRecord as WorkspaceTimer;
  }

  async retrieves(
    workspaceTimerId: number,
    status?: WorkspaceTimerStatus
  ): Promise<WorkspaceTimer[]> {
    type TQueryConditions = {
      workspace_id: number;
      end_time?: {
        $exists: boolean;
      };
    }
    const queryConditions: TQueryConditions = { workspace_id: workspaceTimerId };

    // filter by status
    if (status === WorkspaceTimerStatus.RUNNING) {
      queryConditions.end_time = { $exists: false };
    } else if (status === WorkspaceTimerStatus.ENDED) {
      queryConditions.end_time = { $exists: true };
    }

    const query = WorkspaceTimerModel.find(queryConditions);

    query.getFilter();

    return (await query.exec()) as WorkspaceTimer[];
  }

  async delete(workspaceTimerId: number): Promise<boolean> {
    const deleted = await WorkspaceTimerModel.deleteOne({
      id: workspaceTimerId
    });

    // TODO: Implement Redis queue
    // // ! Get the timer from Redis
    // const workspaceTimerJob =
    //   await workspaceTimerQueue.getJob(workspaceTimerId);

    // // ! Remove the timer from Redis
    // if (workspaceTimerJob && !workspaceTimerJob.processedOn) {
    //   await workspaceTimerJob.remove();
    // }

    return !!deleted;
  }

  async export(
    start_time: Date,
    end_time: Date,
    workspace_id: number
  ): Promise<exceljs.Workbook | null> {
    const workspace = await WorkspaceModel.findOne({ id: workspace_id });

    if (!workspace) return null;

    // ! has valid startDate endDate and is between startTime and endTime
    const workspaceTimers = await WorkspaceTimerModel.find({
      workspace_id,
      start_time: { $gte: start_time, $lte: end_time },
      end_time: { $ne: null }
    }).sort({ start_time: "asc" });

    type TSheetContent = {
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
    };

    const sheetContent = (): TSheetContent[] => {
      const content = workspaceTimers.map((workspaceTimer) => {
        const startDate = new Date(workspaceTimer.start_time); //  YYYY-MM-DD
        const endDate = new Date(workspaceTimer.end_time as Date); //  YYYY-MM-DD

        const date = startDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }); //  DD/MM/YYYY
        const startTime = startDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }); //  HH:MM:SS
        const endTime = endDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }); //  HH:MM:SS
        const durationCalc =
          (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60; //  HH:MM:SS
        const duration = +durationCalc.toFixed(2); //  HH:MM:SS

        return {
          date,
          startTime,
          endTime,
          duration
        };
      });

      return content;
    };

    const workbook = new exceljs.Workbook();

    const sheet = workbook.addWorksheet(workspace.name);
    sheet.columns = [
      { header: "Data", key: "date", width: 16 },
      { header: "Hora de início", key: "startTime", width: 16 },
      { header: "Hora de término", key: "endTime", width: 16 },
      { header: "Duração (horas)", key: "duration", width: 16 }
    ];

    const rows = sheetContent();
    const totalDuration = rows.reduce((acc, row) => acc + row.duration, 0);
    const totalPrice = totalDuration * workspace.price_by_hour;

    sheet.addRows(rows);
    sheet.addRow({ date: "", startTime: "", endTime: "", duration: "" });
    sheet.addRow({
      date: "Total de horas",
      startTime: "",
      endTime: "",
      duration: totalDuration
    });
    sheet.addRow({
      date: "Valor hora",
      startTime: "",
      endTime: "",
      duration: `R$${workspace.price_by_hour.toFixed(2)}`
    });
    sheet.addRow({
      date: "Total: ",
      startTime: "",
      endTime: "",
      duration: `R$${totalPrice.toFixed(2)}`
    });

    return workbook;
  }
}
