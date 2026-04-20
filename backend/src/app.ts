import express from 'express';

import userRoutes from './modules/user/user.routes';
import taskRoutes from './modules/task/task.routes';

import { errorMiddleware } from './shared/middleware/error.middleware';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/task', taskRoutes);

app.use(errorMiddleware);

export { app };