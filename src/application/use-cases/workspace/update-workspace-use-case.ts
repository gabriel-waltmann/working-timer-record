import { WorkspaceRepository } from "../../../domain/repositories/workspace-repository";

export class UpdateWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: number, workspaceName: string, priceByHour: number) {
    const workspace = await this.workspaceRepository.update(workspaceId, workspaceName, priceByHour);

    return workspace;
  }
}