import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class GetWorkspaceByIdUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: string) {
    console.log("get", workspaceId);

    throw new Error('Method not implemented.');
  }
}