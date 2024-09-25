import { Router } from 'express';

import { WorkspaceController } from '../controllers/workspace-controller';
import { CreateWorkspaceUseCase } from '../../application/use-cases/workspace/create-workspace-use-case';
import { UpdateWorkspaceUseCase } from '../../application/use-cases/workspace/update-workspace-use-case';
import { RetrievesWorkspacesUseCase } from '../../application/use-cases/workspace/retrieves-workspace-use-case';
import { RetrievesOneWorkspaceUseCase } from '../../application/use-cases/workspace/retrieves-one-workspace-use-case';
import { DeleteWorkspaceUseCase } from '../../application/use-cases/workspace/delete-workspace-use-case';
import { MongoWorkspaceRepository } from '../../infrastructure/database/workspace-repository-impl';

const workspaceRepository = new MongoWorkspaceRepository();

const createWorkspaceUseCase = new CreateWorkspaceUseCase(workspaceRepository);
const retrievesOneWorkspaceUseCase = new RetrievesOneWorkspaceUseCase(workspaceRepository);
const deleteWorkspaceUseCase = new DeleteWorkspaceUseCase(workspaceRepository);
const updateWorkspaceUseCase = new UpdateWorkspaceUseCase(workspaceRepository);
const retrievesWorkspacesUseCase = new RetrievesWorkspacesUseCase(workspaceRepository);

const workspaceController = new WorkspaceController(
  createWorkspaceUseCase,
  updateWorkspaceUseCase,
  deleteWorkspaceUseCase,
  retrievesWorkspacesUseCase,
  retrievesOneWorkspaceUseCase,
);

const router = Router();

router.post('/', workspaceController.create.bind(workspaceController));
router.get('/:id', workspaceController.retrievesOne.bind(workspaceController));
router.get('/', workspaceController.retrieves.bind(workspaceController));
router.put('/:id', workspaceController.update.bind(workspaceController));
router.delete('/:id', workspaceController.delete.bind(workspaceController));

export default router;
