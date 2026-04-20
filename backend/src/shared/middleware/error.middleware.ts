import { Request, Response, NextFunction } from 'express';
import { UserNotFoundError, UserAlreadyExistsError } from '../../modules/user/user.errors';
import { 
  TaskNotFoundError,
  TaskLimitExceededError,
  InvalidTaskStatusTransitionError,
  TaskAlreadyCompletedError,
  TaskDeletionNotAllowedError
} from '../../modules/task/task.errors';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  //user errors
  if (err instanceof UserNotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof UserAlreadyExistsError) {
    return res.status(409).json({ message: err.message });
  }

  //task errors
  if(err instanceof TaskNotFoundError){
    return res.status(404).json({ message: err.message});
  }

  if(err instanceof TaskLimitExceededError){
    return res.status(400).json({ message: err.message});
  }

  if(err instanceof InvalidTaskStatusTransitionError){
    return res.status(400).json({ message: err.message});
  }

  if(err instanceof TaskAlreadyCompletedError){
    return res.status(400).json({ message: err.message});
  }

  if(err instanceof TaskDeletionNotAllowedError){
    return res.status(400).json({ message: err.message});
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error'
  });
};