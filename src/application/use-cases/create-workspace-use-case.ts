import { WorkspaceRepository } from '../../domain/repositories/workspace-repository';

export class CreateWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceName: string) {
    const workspace = await this.workspaceRepository.create(workspaceName);

    return workspace;
  }
}