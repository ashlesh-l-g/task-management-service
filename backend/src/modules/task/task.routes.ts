import { Router } from 'express';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/', taskController.listTask);
router.get('/:id', taskController.getTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;