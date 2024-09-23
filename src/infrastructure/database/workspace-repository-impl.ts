import WorkspaceModel from '../database/models/workspace';
import { WorkspaceRepository } from '../../domain/repositories/workspace-repository';
import { Workspace } from '../../domain/entities/workspace';

export class MongoWorkspaceRepository implements WorkspaceRepository {
  async create(workspaceName: string): Promise<Workspace> {
    const workspace = new WorkspaceModel({
      id: Date.now(), 
      name: workspaceName,
    });

    try {
      await workspace.save();  

      return workspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw new Error('Could not create workspace'); 
    }
  }

  async retrievesOne(workspaceId: number): Promise<Workspace> {
    const workspace = await WorkspaceModel.findOne({ id: workspaceId });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    return workspace;
  }
}
