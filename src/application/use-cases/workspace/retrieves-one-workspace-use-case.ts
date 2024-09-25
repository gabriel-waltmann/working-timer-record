import { WorkspaceRepository } from "../../../domain/repositories/workspace-repository";

export class RetrievesOneWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: number) {
    const workspace = await this.workspaceRepository.retrievesOne(workspaceId);

    return workspace; 
  }
}