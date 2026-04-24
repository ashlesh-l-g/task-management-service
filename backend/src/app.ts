import express from 'express';
import cors from "cors";

import userRoutes from './modules/user/user.routes';
import taskRoutes from './modules/task/task.routes';
import paymentRoutes from "./modules/payment/payment.routes";


import { errorMiddleware } from './shared/middleware/error.middleware';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.use(errorMiddleware);

app.use("/payments", paymentRoutes);

export { app };