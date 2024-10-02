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

/**
 * @openapi 
 * /workspaces:
 *  post:
 *    tags: [Workspace]
 *    summary: Create a new workspace
 *    description: Create a new workspace
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkspaceCreate'
 *    responses:
 *      201:
 *        description: Workspace created
 *      400:
 *        description: Workspace already exists
 *      500:
 *        description: Server error
 * 
 */
router.post('/', workspaceController.create.bind(workspaceController));

/**
 * @openapi 
 * /workspaces/:id:
 *  put:
 *    tags: [Workspace]
 *    summary: Update a workspace
 *    description: Update a workspace
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Workspace ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Workspace'
*/
router.put('/:id', workspaceController.update.bind(workspaceController));

/**
 * @openapi 
 * /workspaces/:id:
 *  get:
 *    tags: [Workspace]
 *    summary: Retrieve a workspace
 *    description: Retrieve a workspace
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Workspace ID
 *    responses:
 *      200:
 *        description: Workspace retrieved
 *        content:
 *          application/json: 
 *            schema:
 *              $ref: '#/components/schemas/Workspace'
 *      404:
 *        description: Workspace not found
 *      500:
 *        description: Server error
 */
router.get('/:id', workspaceController.retrievesOne.bind(workspaceController));

/**
 * @openapi 
 * /workspaces:
 *  get:
 *    tags: [Workspace]
 *    summary: Retrieve all workspaces
 *    description: Retrieve all workspaces
 *    responses:
 *      200:
 *        description: Workspaces retrieved
 *        content:
 *          application/json: 
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Workspace'
 *      500:
 *        description: Server error
 */
router.get('/', workspaceController.retrieves.bind(workspaceController));

/**
 * @openapi 
 * /workspaces/:id:
 *  delete:
 *    tags: [Workspace]
 *    summary: Delete a workspace
 *    description: Delete a workspace
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Workspace ID
 *    responses:
 *      204:
 *        description: Workspace deleted
 *      404:
 *        description: Workspace not found
 *      500:
 *        description: Server error
*/
router.delete('/:id', workspaceController.delete.bind(workspaceController));

export default router;
