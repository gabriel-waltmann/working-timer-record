export class WorkspaceTimer {
  constructor(
    public id: string,
    public workspaceId: number,
    public startTime: Date,
    public endTime: Date,
  ) {}
}
