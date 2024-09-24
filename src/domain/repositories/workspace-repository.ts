import { Workspace } from "../entities/workspace";

export interface WorkspaceRepository {
  create(workspaceName: string): Promise<Workspace>,
  retrievesOne(workspaceId: number): Promise<Workspace | null>,
  update(workspaceId: number, workspaceName: string): Promise<Workspace | null>,
  delete(workspaceId: number): Promise<void>
  retrieves(): Promise<Workspace[]>
}