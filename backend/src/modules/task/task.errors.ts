export class TaskNotFoundError extends Error {
    constructor() {
        super('Task not found');
        this.name = 'TaskNotFoundError';
    }
}

export class TaskLimitExceededError extends Error {
    constructor() {
        super('Daily task limit exceeded');
        this.name = 'TaskLimitExceededError';
    }
}

export class InvalidTaskStatusTransitionError extends Error{
    constructor() {
        super('Invalid task status transition');
        this.name = 'InvalidTaskStatusTransitionError';
    }
}

export class TaskAlreadyCompletedError extends Error {
    constructor() {
        super('Task is already completed');
        this.name = 'TaskAlreadyCompletedError';
    }
}

export class TaskDeletionNotAllowedError extends Error {
    constructor() {
        super('Task can only be deleted when status is DONE');
        this.name = 'TaskDeletionNotAllowedError';
    }
}