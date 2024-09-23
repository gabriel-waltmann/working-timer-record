import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class GetAllWorkspacesUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute() {
    throw new Error('Method not implemented.');
  }
}