import { Request, Response } from 'express';
import { ITaskService } from './task.service';
import { validateCreateTask, validateUpdateTask } from './task.validator';


export class TaskController {
    constructor(private readonly taskService: ITaskService) {}

    createTask = async (req: Request, res: Response) => {

        validateCreateTask(req.body);

        const { title, priority } = req.body;
        const userId = req.user.id;

        const task = await this.taskService.createTask(
            title,
            priority,
            userId
        );

        res.status(201).json(task);
    };

    getTask = async (req: Request, res: Response) => {
        const { id } = req.params as {id: string };
        const userId = req.user.id;

        const task = await this.taskService.getTask(id, userId);

        res.status(200).json(task);
    };

    listTask = async (req: Request, res: Response) => {
        const userId = req.user.id;

        const tasks = await this.taskService.listTasks(userId);

        res.status(200).json(tasks);
    };

    updateTask = async (req: Request, res: Response) => {

        validateUpdateTask(req.body);

        const { id } = req.params as { id: string };
        const userId = req.user.id;

        const updated = await this.taskService.updateTask(
            id,
            userId,
            req.body
        );

        res.status(200).json(updated);
    };

    deleteTask = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const userId = req.user.id;

        await this.taskService.deleteTask(id, userId);

        res.status(204).send();
    }
}