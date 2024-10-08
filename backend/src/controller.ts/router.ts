import { Router } from "express";
import { UserControllers } from "./usermanagement/controller";
import { upload } from "../imageupload";
import usersSessionHandler from "../authHandler/middlewareauthHandler";

export const userManagementRouter: Router = Router();

userManagementRouter.post('/register', upload, UserControllers.createUser);
userManagementRouter.post('/login', UserControllers.loginUser);
userManagementRouter.post('/forgetpassword', UserControllers.forgetUser);
userManagementRouter.post('/resetpassword', UserControllers.resetpassword);
userManagementRouter.put('/confirmpassword', UserControllers.confirmpassword);

userManagementRouter.get('/myprofile', usersSessionHandler, UserControllers.getuserprofile);
userManagementRouter.put('/myprofile', usersSessionHandler, UserControllers.Updateuser);


userManagementRouter.post("/plans", UserControllers.createplan);
userManagementRouter.get('/plans', UserControllers.getplan);
userManagementRouter.get('/plans/:planId', UserControllers.getplanid);  