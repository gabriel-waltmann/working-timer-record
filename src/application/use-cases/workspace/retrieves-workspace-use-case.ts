import { WorkspaceRepository } from "../../../domain/repositories/workspace-repository";

export class RetrievesWorkspacesUseCase {
  constructor(readonly workspaceRepository: WorkspaceRepository) {}

  async execute() {
    const workspaces = await this.workspaceRepository.retrieves();

    return workspaces;
  }
}
