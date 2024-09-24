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

  async retrievesOne(workspaceId: number): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({ id: workspaceId });

    if (!workspace) return null;

    return workspace;
  }

  async retrieves(): Promise<Workspace[]> {
    const workspaces = await WorkspaceModel.find();

    return workspaces;
  }

  async update(workspaceId: number, workspaceName: string): Promise<Workspace | null> {
    const filter = { id: workspaceId };

    const update = { name: workspaceName };

    return await WorkspaceModel.findOneAndUpdate(filter, update, { new: true });
  }

  async delete(workspaceId: number): Promise<void> {
    await WorkspaceModel.deleteOne({ id: workspaceId });
  }
}
