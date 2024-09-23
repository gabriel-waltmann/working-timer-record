import { Workspace } from "../entities/workspace";

export interface WorkspaceRepository {
  create(workspaceName: string): Promise<Workspace>
}