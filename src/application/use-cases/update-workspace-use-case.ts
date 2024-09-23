import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class UpdateWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: string, workspaceName: string) {
    console.log("update", workspaceId, workspaceName);

    throw new Error('Method not implemented.');
  }
}