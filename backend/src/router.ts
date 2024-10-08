import { Router } from "express";
import { userManagementRouter } from "./controller.ts/router";
export const router: Router = Router()
router.use('/usermanagement', userManagementRouter)
