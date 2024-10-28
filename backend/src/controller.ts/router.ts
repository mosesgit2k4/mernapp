import { Router } from "express";
import { UserControllers, PlanControllers, TransactionControllers } from "./usermanagement/controller";
import { upload } from "../imageupload";
import usersSessionHandler from "../authHandler/middlewareauthHandler";
import Plan from "../model/planModel";

export const userManagementRouter: Router = Router();

userManagementRouter.post('/register', upload, UserControllers.createUser);
userManagementRouter.post('/login', UserControllers.loginUser);
userManagementRouter.post('/forgetpassword', UserControllers.forgetUser);
userManagementRouter.post('/resetpassword', UserControllers.resetpassword);
userManagementRouter.put('/confirmpassword', UserControllers.confirmpassword);
userManagementRouter.get('/users',UserControllers.getallusers)
userManagementRouter.get('/myprofile', usersSessionHandler, UserControllers.getuserprofile);
userManagementRouter.put('/myprofile', usersSessionHandler, UserControllers.Updateuser);


userManagementRouter.post("/plans",upload, PlanControllers.createplan);
userManagementRouter.get('/plans', PlanControllers.getplan);
userManagementRouter.post('/planbyid', PlanControllers.getplanid);  
userManagementRouter.get('/getplanselected',usersSessionHandler)
userManagementRouter.post("/getplanidforselectedplan",PlanControllers.getplanidforselectedplan)


userManagementRouter.post('/transaction', TransactionControllers.createtransactions);
userManagementRouter.get('/transaction',usersSessionHandler, TransactionControllers.getransactionbyid);
userManagementRouter.delete('/transactiondelete',TransactionControllers.softdeletetransactionid)
userManagementRouter.get('/latestplan',usersSessionHandler,TransactionControllers.latestplan)