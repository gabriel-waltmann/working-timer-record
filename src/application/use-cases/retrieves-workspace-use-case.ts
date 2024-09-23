import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class RetrievesWorkspacesUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute() {
    const workspaces = await this.workspaceRepository.retrieves();

    return workspaces;
  }
}