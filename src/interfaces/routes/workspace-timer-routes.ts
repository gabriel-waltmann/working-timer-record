import { Router } from 'express';

import { StartTimerUseCase } from '../../application/use-cases/workspace-timer/start-timer-use-case';
import { EndTimerUseCase } from '../../application/use-cases/workspace-timer/end-timer-use-case';
import { RetrievesOneTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-one-timer-use-case';
import { WorkspaceTimerController } from '../controllers/workspace-timer-controller';
import { MongoWorkspaceTimerRepository } from '../../infrastructure/database/workspace-timer-repository-impl';
import { RetrievesTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-timer-use-case';
import { DeleteTimerUseCase } from '../../application/use-cases/workspace-timer/delete-timer-use-case';
import { ExportWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/export-workspace-timer-use-case';
import { CreateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/create-workspace-timer-use-case';
import { UpdateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/update-workspace-timer-use-case';

const workspaceTimerRepository = new MongoWorkspaceTimerRepository();

const createWorkspaceTimerUseCase = new CreateWorkspaceTimerUseCase(workspaceTimerRepository);
const updateWorkspaceTimerUseCase = new UpdateWorkspaceTimerUseCase(workspaceTimerRepository);
const startTimerUseCase = new StartTimerUseCase(workspaceTimerRepository);
const endTimerUseCase = new EndTimerUseCase(workspaceTimerRepository);
const retrievesOneTimerUseCase = new RetrievesOneTimerUseCase(workspaceTimerRepository);
const retrievesTimerUseCase = new RetrievesTimerUseCase(workspaceTimerRepository);
const deleteTimerUseCase = new DeleteTimerUseCase(workspaceTimerRepository);
const exportWorkspaceTimerUseCase = new ExportWorkspaceTimerUseCase(workspaceTimerRepository);

const timerController = new WorkspaceTimerController(
  createWorkspaceTimerUseCase,
  updateWorkspaceTimerUseCase,
  startTimerUseCase, 
  endTimerUseCase, 
  retrievesOneTimerUseCase,
  retrievesTimerUseCase,
  deleteTimerUseCase,
  exportWorkspaceTimerUseCase,
);

const router = Router();

/**
 * @openapi 
 * /workspace-timer:
 *  post:
 *    tags: [WorkspaceTimer]
 *    summary: Create a custom timer
 *    description: Create a custom timer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkspaceTimerCreate'
 *    responses:
 *      201:
 *        description: Timer created
 *        content:
 *            application/json: 
 *              schema:
 *                $ref: '#/components/schemas/WorkspaceTimer'
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
*/
router.post('/', timerController.create.bind(timerController));

/**
 * @openapi
 * /workspace-timer/:id:
 *  put:
 *    tags: [WorkspaceTimer]
 *    summary: Update a timer
 *    description: Update a timer
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Timer ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkspaceTimerUpdate'
 *    responses:
 *      200:
 *        description: Timer updated
 *        content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/WorkspaceTimer'
 *      404:
 *        description: Timer not found
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.put('/:id', timerController.update.bind(timerController));

/**
 * @openapi 
 * /workspace-timer/start:
 *  post:
 *    tags: [WorkspaceTimer]
 *    summary: Start a new timer
 *    description: Start a new timer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkspaceTimerStart'
 *    responses:
 *      200:
 *        description: Timer started
 *      500:
 *        description: Server error
 * */
router.post('/start', timerController.start.bind(timerController));

/**
 * @openapi 
 * /workspace-timer/end:
 *  post:
 *    tags: [WorkspaceTimer]
 *    summary: End a timer
 *    description: End a timer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkspaceTimerEnd'
 *    responses:
 *      204:
 *        description: Timer ended
 *      404:
 *        description: Timer not found
 *      500:
 *        description: Server error
 * */
router.post('/end', timerController.end.bind(timerController));

/**
 * @openapi 
 * /workspace-timer/{id}:
 *  get:
 *    tags: [WorkspaceTimer]
 *    summary: Retrieve a timer
 *    description: Retrieve a timer
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Timer ID
 *    responses:
 *      200:
 *        description: Timer retrieved
 *        content:
 *          application/json: 
 *            schema:
 *              $ref: '#/components/schemas/WorkspaceTimer'
 *      404:
 *        description: Timer not found
 *      500:
 *        description: Server error
*/
router.get('/:id', timerController.retrievesOne.bind(timerController));

/**
 * @openapi 
 * /workspace-timer/{id}:
 *  delete:
 *    tags: [WorkspaceTimer]
 *    summary: Delete a timer
 *    description: Delete a timer
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Timer ID
 *    responses:
 *      204:
 *        description: Timer deleted
 *      404:
 *        description: Timer not found
 *      500:
 *        description: Server error
*/
router.delete('/:id', timerController.delete.bind(timerController));

/**
 * @openapi 
 * /workspace-timer:
 *  get:
 *    tags: [WorkspaceTimer]
 *    summary: Retrieve timers
 *    description: Retrieve timers
 *    responses:
 *      200:
 *        description: Timers retrieved
 *        content:
 *          application/json: 
 *            schema:
 *              type: array
 *              $ref: '#/components/schemas/WorkspaceTimer'
 *      500:
 *        description: Server error
*/
router.get('/', timerController.retrieves.bind(timerController));

/**
 * @openapi 
 * /workspace-timer/export:
 *  post:
 *    tags: [WorkspaceTimer]
 *    summary: Export timer
 *    description: Gererate a excel file with the timers
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkspaceTimerExport'
 *    responses:
 *      201:
 *        description: Timer exported
 *      500:
 *        description: Server error
 */
router.post('/export', timerController.export.bind(timerController));

export default router;