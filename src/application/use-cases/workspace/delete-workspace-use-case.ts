import { WorkspaceRepository } from "../../../domain/repositories/workspace-repository";

export class DeleteWorkspaceUseCase {
  constructor(readonly workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: number) {
    await this.workspaceRepository.delete(workspaceId);
  }
}
