import { Task } from'./task.types';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';

export interface ITaskRepository {
    create(data : {
        title: string;
        priority: TaskPriority;
        userId: string;
    }): Promise<Task>

    findByIdAndUserId(id: string, userId: string): Promise<Task | null>;

    listByUser(userId: string): Promise<Task[]>;

    countByUserAndDate(userId: string, start: Date, end: Date): Promise<number>;

    update(id: string, data: {
        title?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
    }): Promise<Task>;

    softDelete(id: string): Promise<void>;
}

export class TaskRepository implements ITaskRepository {
    async create(data: {
        title: string;
        priority: TaskPriority;
        userId: string;
    }): Promise<Task> {

        const created = await prisma.task.create({
            data: {
                title: data.title,
                priority: data.priority,
                userId: data.userId
            }
        });

        return {
            id: created.id,
            title: created.title,
            status: created.status,
            priority: created.priority,
            userId: created.userId,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
            deletedAt: created.deletedAt
        };
    }

    async findByIdAndUserId(
        id: string,
        userId: string
    ): Promise<Task | null> {

        const found = await prisma.task.findFirst({
            where: {
                id,
                userId,
                deletedAt: null
            }
        });

        if(!found) return null;

        return{
            id: found.id,
            title: found.title,
            status: found.status,
            priority: found.priority,
            userId: found.userId,
            createdAt: found.createdAt,
            updatedAt: found.updatedAt,
            deletedAt: found.deletedAt
        };
    }

    async listByUser(userId: string): Promise<Task[]> {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return tasks.map(task =>({
            id: task.id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            userId: task.userId,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            deletedAt: task.deletedAt
        }));
    }

    async countByUserAndDate(
        userId: string,
        start: Date,
        end: Date
    ): Promise<number> {
        return prisma.task.count({
            where: {
                userId,
                deletedAt: null,
                createdAt: {
                    gte: start,
                    lt: end
                }
            }
        });
    }

    async update(
        id: string,
        data: {
            title?: string;
            status?: TaskStatus;
            priority?: TaskPriority;
        }
    ): Promise<Task> {

        const updated = await prisma.task.update({
            where: { id },
            data
        });

        return {
            id: updated.id,
            title: updated.title,
            status: updated.status,
            priority: updated.priority,
            userId: updated.userId,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
            deletedAt: updated.deletedAt
        };
    }

    async softDelete(id: string): Promise<void> {
        await prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });
    }
}