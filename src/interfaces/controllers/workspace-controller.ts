import { Request, Response } from 'express';

import { CreateWorkspaceUseCase } from '../../application/use-cases/create-workspace-use-case';
import { UpdateWorkspaceUseCase } from '../../application/use-cases/update-workspace-use-case';
import { DeleteWorkspaceUseCase } from '../../application/use-cases/delete-workspace-use-case';
import { GetAllWorkspacesUseCase } from '../../application/use-cases/get-all-workspaces-use-case';
import { GetWorkspaceByIdUseCase } from '../../application/use-cases/get-workspace-by-id-use-case';

export class WorkspaceController {
  constructor(
    private createWorkspace: CreateWorkspaceUseCase,
    private updateWorkspace: UpdateWorkspaceUseCase,
    private deleteWorkspace: DeleteWorkspaceUseCase,
    private getAllWorkspaces: GetAllWorkspacesUseCase,
    private getWorkspaceById: GetWorkspaceByIdUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const workspace = await this.createWorkspace.execute(req.body.name);

    res.status(201).json({ workspace });
  }

  async update(req: Request, res: Response): Promise<void> {
    console.log("update", req.params.id, req.body.name);
    // const workspace = await this.updateWorkspace.execute(req.params.id, req.body.name);
    res.status(200).json({});
  }

  async delete(req: Request, res: Response): Promise<void> {
    console.log("delete", req.params.id);
    // await this.deleteWorkspace.execute(req.params.id);
    res.status(204).json({});
  }

  async getAll(req: Request, res: Response): Promise<void> {
    console.log("getAll");
    // const workspaces = await this.getAllWorkspaces.execute();
    res.status(200).json({});
  }

  async getById(req: Request, res: Response): Promise<void> {
    console.log("getById", req.params.id);
    // const workspace = await this.getWorkspaceById.execute(req.params.id);
    res.status(200).json({});
  }
}