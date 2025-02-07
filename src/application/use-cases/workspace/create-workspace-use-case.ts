import { WorkspaceRepository } from "../../../domain/repositories/workspace-repository";

export class CreateWorkspaceUseCase {
  constructor(readonly workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceName: string, priceByHour: number) {
    const workspace = await this.workspaceRepository.create(
      workspaceName,
      priceByHour
    );

    return workspace;
  }
}
