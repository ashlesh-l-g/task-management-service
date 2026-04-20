import { Task } from '@prisma/client';
import { TaskPriority, TaskStatus } from '@prisma/client';

export const validateCreateTask = (data: {
    title?: string;
    priority?: TaskPriority;
}) => {
    if(!data.title || data.title.trim().length === 0) {
        throw new Error('Title is required');
    }

    if(data.priority && !Object.values(TaskPriority).includes(data.priority)) {
        throw new Error('Invalid priority');
    }
};

export const validateUpdateTask = (data: {
    title?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}) => {
    if (data.title !== undefined && data.title.trim().length === 0) {
        throw new Error('Title cannot be empty');
    }

    if (data.status && !Object.values(TaskStatus).includes(data.status)) {
        throw new Error('Invalid status');
    }

    if (data.priority && !Object.values(TaskPriority).includes(data.priority)) {
        throw new Error('Invalid priority');
    }
};