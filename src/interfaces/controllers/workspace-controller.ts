import { Request, Response } from 'express';

import { CreateWorkspaceUseCase } from '../../application/use-cases/create-workspace-use-case';
import { UpdateWorkspaceUseCase } from '../../application/use-cases/update-workspace-use-case';
import { DeleteWorkspaceUseCase } from '../../application/use-cases/delete-workspace-use-case';
import { RetrievesWorkspacesUseCase } from '../../application/use-cases/retrieves-workspace-use-case';
import { RetrievesOneWorkspaceUseCase } from '../../application/use-cases/retrieves-one-workspace-use-case';

export class WorkspaceController {
  constructor(
    private createWorkspace: CreateWorkspaceUseCase,
    private updateWorkspace: UpdateWorkspaceUseCase,
    private deleteWorkspace: DeleteWorkspaceUseCase,
    private retrievesWorkspacesUseCase: RetrievesWorkspacesUseCase,
    private retrievesOneWorkspace: RetrievesOneWorkspaceUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const workspace = await this.createWorkspace.execute(req.body.name);

    if (!workspace) {
      res.status(500).json({ error: 'Failed to create workspace' });
      
      return;
    }

    res.status(201).json({ workspace });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const workspace = await this.updateWorkspace.execute(id, req.body.name);

    if (!workspace) {
      res.status(500).json({ error: 'Failed to update workspace' });
      return;
    }

    res.status(200).json({ workspace });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    await this.deleteWorkspace.execute(id);

    res.status(204).send();
  }

  async retrieves(req: Request, res: Response): Promise<void> {
    const workspaces = await this.retrievesWorkspacesUseCase.execute();
    
    res.status(200).json({ workspaces });
  }

  async retrievesOne(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const workspace = await this.retrievesOneWorkspace.execute(id);

    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found' });

      return;
    }

    res.status(200).json({ workspace });
  }
}