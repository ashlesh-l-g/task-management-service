import { TaskStatus, TaskPriority } from '@prisma/client';

export interface Task{
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}