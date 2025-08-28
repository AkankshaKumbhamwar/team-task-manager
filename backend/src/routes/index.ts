import Router from "express"
import { registerRouter } from "../controller/auth"
export const routes = Router()

routes.use("/api/auth",registerRouter)