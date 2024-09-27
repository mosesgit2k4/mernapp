import { Router } from "express";
import { UserControllers } from "./usermanagement/controller";
export const userManagementRouter:Router = Router()

userManagementRouter.post('/user',UserControllers.createUser)