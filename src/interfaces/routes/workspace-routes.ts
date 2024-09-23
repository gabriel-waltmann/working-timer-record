import { Router } from 'express';

import { WorkspaceController } from '../controllers/workspace-controller';
import { CreateWorkspaceUseCase } from '../../application/use-cases/create-workspace-use-case';
import { UpdateWorkspaceUseCase } from '../../application/use-cases/update-workspace-use-case';
import { GetAllWorkspacesUseCase } from '../../application/use-cases/get-all-workspaces-use-case';
import { GetWorkspaceByIdUseCase } from '../../application/use-cases/get-workspace-by-id-use-case';
import { DeleteWorkspaceUseCase } from '../../application/use-cases/delete-workspace-use-case';
import { MongoWorkspaceRepository } from '../../infrastructure/database/workspace-repository-impl';

const workspaceRepository = new MongoWorkspaceRepository();

const createWorkspaceUseCase = new CreateWorkspaceUseCase(workspaceRepository);
const updateWorkspaceUseCase = new UpdateWorkspaceUseCase(workspaceRepository);
const deleteWorkspaceUseCase = new DeleteWorkspaceUseCase(workspaceRepository);
const getAllWorkspacesUseCase = new GetAllWorkspacesUseCase(workspaceRepository);
const getWorkspaceByIdUseCase = new GetWorkspaceByIdUseCase(workspaceRepository);

const workspaceController = new WorkspaceController(
  createWorkspaceUseCase,
  updateWorkspaceUseCase,
  deleteWorkspaceUseCase,
  getAllWorkspacesUseCase,
  getWorkspaceByIdUseCase
)

const router = Router();

router.post('/', workspaceController.create.bind(workspaceController));
router.put('/:id', workspaceController.update.bind(workspaceController));
router.delete('/:id', workspaceController.delete.bind(workspaceController));
router.get('/', workspaceController.getAll.bind(workspaceController));
router.get('/:id', workspaceController.getById.bind(workspaceController));

export default router;
