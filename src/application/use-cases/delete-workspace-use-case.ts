import { WorkspaceRepository } from "../../domain/repositories/workspace-repository";

export class DeleteWorkspaceUseCase {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: string) {
    console.log("delete", workspaceId);
    
    throw new Error('Method not implemented.');
  }
}