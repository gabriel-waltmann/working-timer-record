import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class UpdateWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: number, workspaceName: string) {
    const workspace = await this.workspaceRepository.update(workspaceId, workspaceName);

    return workspace;
  }
}