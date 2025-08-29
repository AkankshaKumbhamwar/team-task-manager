import Router from "express"
import { authRouter } from "../controller/auth"
import { taskRoutes } from "../controller/tasks";
import { projectRoutes } from "../controller/project";
export const routes = Router()

routes.use("/api/auth", authRouter)
routes.use('/api/projects', projectRoutes);
routes.use('/api/tasks', taskRoutes);