import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class UpdateWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: string, workspaceName: string) {
    throw new Error('Method not implemented.');
  }
}