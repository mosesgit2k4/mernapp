import { Router } from "express";
import { UserControllers } from "./usermanagement/controller";
import { upload } from "../imageupload";  // Ensure correct middleware
import usersSessionHandler from "../authHandler/middlewareauthHandler";

export const userManagementRouter: Router = Router();

// User Registration, Login, Password Management
userManagementRouter.post('/register', upload, UserControllers.createUser);  // Register user with file upload (if required)
userManagementRouter.post('/login', UserControllers.loginUser);  // User login
userManagementRouter.post('/forgetpassword', UserControllers.forgetUser);  // Forgot password route
userManagementRouter.post('/resetpassword', UserControllers.resetpassword);  // Reset password with OTP
userManagementRouter.put('/confirmpassword', UserControllers.confirmpassword);  // Confirm new password

// User Profile Management (protected routes)
userManagementRouter.get('/myprofile', usersSessionHandler, UserControllers.getuserprofile);  // Get user profile
userManagementRouter.put('/myprofile', usersSessionHandler, UserControllers.updateuser);  // Update user profile

// Plan Management
userManagementRouter.post("/plans", UserControllers.createplan);  // Create a new plan
userManagementRouter.get('/plans', UserControllers.getplan);  // Get all plans
userManagementRouter.get('/plans/:planId', UserControllers.getplanid);  // Get plan by ID
