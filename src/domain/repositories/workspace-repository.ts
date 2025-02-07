import { Workspace } from "../entities/workspace";

export interface WorkspaceRepository {
  create(workspaceName: string, priceByHour: number): Promise<Workspace>;
  retrievesOne(workspaceId: number): Promise<Workspace | null>;
  update(
    workspaceId: number,
    workspaceName: string,
    priceByHour: number
  ): Promise<Workspace | null>;
  delete(workspaceId: number): Promise<void>;
  retrieves(): Promise<Workspace[]>;
}
