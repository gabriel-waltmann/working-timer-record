export enum WorkspaceTimerStatus {
  ENDED = 0,
  RUNNING = 1,
}

export class WorkspaceTimer {
  constructor(
    public id: number,
    public workspace_id: number,
    public start_time: Date | string,
    public end_time: Date | string | undefined,
  ) {}
}
