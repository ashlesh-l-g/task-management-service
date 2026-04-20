import { ITaskRepository } from './task.repository';
import { Task, TaskPriority, TaskStatus } from '@prisma/client';
import {
  TaskNotFoundError,
  TaskLimitExceededError,
  InvalidTaskStatusTransitionError,
  TaskAlreadyCompletedError,
  TaskDeletionNotAllowedError
} from './task.errors';

export interface ITaskService {
  createTask(title: string, priority: TaskPriority, userId: string): Promise<Task>;
  getTask(id: string, userId: string): Promise<Task>;
  listTasks(userId: string): Promise<Task[]>;
  updateTask(
    id: string,
    userId: string,
    data: {
      title?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    }
  ): Promise<Task>;
  deleteTask(id: string, userId: string): Promise<void>;
}

export class TaskService implements ITaskService {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async createTask(
    title: string,
    priority: TaskPriority,
    userId: string
  ): Promise<Task> {

    const now = new Date();

    const startOfDayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,0,0
    ));

    const endOfDayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,0,0
    ));

    const count = await this.taskRepo.countByUserAndDate(
        userId,
        startOfDayUTC,
        endOfDayUTC
    );

    if(count >= 50){
        throw new TaskLimitExceededError();
    }

    return this.taskRepo.create({
        title,
        priority,
        userId
    });
  }
  async getTask(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepo.findByIdAndUserId(id, userId);

    if(!task){
      throw new TaskNotFoundError();
    }

    return task;
  }

  async listTasks(userId: string): Promise<Task[]> {
    return this.taskRepo.listByUser(userId);
  }

  async updateTask(
    id: string,
    userId: string,
    data: {
      title?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    }
  ): Promise<Task> {

    const task = await this.taskRepo.findByIdAndUserId(id, userId);

    if(!task){
      throw new TaskNotFoundError();
    }

    if(task.status === TaskStatus.DONE) {
      throw new TaskAlreadyCompletedError();
    }

    if (data.status) {
    const validTransition =
      (task.status === TaskStatus.TODO &&
        data.status === TaskStatus.IN_PROGRESS) ||
      (task.status === TaskStatus.IN_PROGRESS &&
        data.status === TaskStatus.DONE);

      if (!validTransition) {
        throw new InvalidTaskStatusTransitionError();
      }
    }

    return this.taskRepo.update(id, data);
  }

    async deleteTask(id: string, userId: string): Promise<void> {
    const task = await this.taskRepo.findByIdAndUserId(id, userId);

    if (!task) {
      throw new TaskNotFoundError();
    }

    if (task.status !== TaskStatus.DONE) {
      throw new TaskDeletionNotAllowedError();
    }

    await this.taskRepo.softDelete(id);
  }
}