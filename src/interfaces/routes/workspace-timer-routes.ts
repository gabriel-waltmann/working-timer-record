import { Router } from 'express';
import { StartTimerUseCase } from '../../application/use-cases/workspace-timer/start-timer-use-case';
import { EndTimerUseCase } from '../../application/use-cases/workspace-timer/end-timer-use-case';
import { RetrievesOneTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-one-timer-use-case';
import { WorkspaceTimerController } from '../controllers/workspace-timer-controller';
import { MongoWorkspaceTimerRepository } from '../../infrastructure/database/workspace-timer-repository-impl';
import { RetrievesTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-timer-use-case';
import { DeleteTimerUseCase } from '../../application/use-cases/workspace-timer/delete-timer-use-case';
import { ExportWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/export-workspace-timer-use-case';

const workspaceTimerRepository = new MongoWorkspaceTimerRepository();

const startTimerUseCase = new StartTimerUseCase(workspaceTimerRepository);
const endTimerUseCase = new EndTimerUseCase(workspaceTimerRepository);
const retrievesOneTimerUseCase = new RetrievesOneTimerUseCase(workspaceTimerRepository);
const retrievesTimerUseCase = new RetrievesTimerUseCase(workspaceTimerRepository);
const deleteTimerUseCase = new DeleteTimerUseCase(workspaceTimerRepository);
const exportWorkspaceTimerUseCase = new ExportWorkspaceTimerUseCase(workspaceTimerRepository);

const timerController = new WorkspaceTimerController(
  startTimerUseCase, 
  endTimerUseCase, 
  retrievesOneTimerUseCase,
  retrievesTimerUseCase,
  deleteTimerUseCase,
  exportWorkspaceTimerUseCase,
);

const router = Router();

router.post('/start', timerController.start.bind(timerController));
router.post('/end', timerController.end.bind(timerController));
router.get('/:id', timerController.retrievesOne.bind(timerController));
router.delete('/:id', timerController.delete.bind(timerController));
router.get('/', timerController.retrieves.bind(timerController));
router.post('/export', timerController.export.bind(timerController));

export default router;