import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class DeleteWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: number) {
    await this.workspaceRepository.delete(workspaceId);
  }
}