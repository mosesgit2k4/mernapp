import { Response,Request } from "express";
import { UserServices } from "../../service/service";
import { compare } from "bcrypt";
import {sign} from 'jsonwebtoken'
import Joi from "joi";
import nodemailer from 'nodemailer'
import dotenv, { secret_token } from "../../config/dotenv";
import { configDotenv } from "dotenv";
import { AuthenticatedRequest } from "../../authHandler/middlewareauthHandler";

interface LoginRequest extends Request {
    body: {
      username: string;
      password: string;
    };
  }
let otp_store: string[] = [];
let emailstore: string[] = [];

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.gmail,
        pass: dotenv.password
    }
});
const PostBody = Joi.object({
    firstName: Joi.string().required().min(3).max(10).messages({
        'string.base': "FirstName must be string",
        'string.empty': "FirstName must not be empty",
        'string.min': 'There must be atleast 3 character',
        'any.required': "FirstName is required"

    }),
    lastName: Joi.string().min(3).max(10).required().messages({
        'string.base': "LastName must be string",
        'string.empty': "LastName must not be empty",
        'string.min': 'There must be atleast 3 character',
        'any.required': "LastName is required"

    }),
    email: Joi.string().email().required().lowercase().messages({
        'string.base': "Email must be string",
        'string.empty': "Email must not be empty",
        'string.email': "Email must be like a email Id example:helloworld@gmail.com",
        'any.required': "Email is required"

    }),
    username: Joi.string().required().messages({
        'string.base': "Username must be string",
        'string.empty': "Username must not be empty",
        'any.required': "Username is required"
    }),
    password: Joi.string().required().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/).min(8).messages({
        'string.base': "Password must be string",
        'string.empty': "Password must not be empty",
        'any.required': "Password is required",
        'string.pattern.base': 'Minimum 8 character is needed and atleast 1 uppercase , 1 lowercase and 1 digit is required'

    }),
    phonenumber: Joi.number().required().max(10 ** 10 - 1).min(10 ** 9).required().messages({
        'number.base': "Mobile Number must be number",
        'number.min': "Number must be 10 digit",
        'number.max': "Number must be 10 digit",
        'any.required': "Mobile Number is required"

    }),
    image: Joi.string().required().messages({
        'any.required': "Give a proper image"
    }),
    isadmin:Joi.string().required(),
    country: Joi.string().required(),
    state:Joi.string().required(),
    city:Joi.string().required(),
    addresses:Joi.string().required(),
    zipcode:Joi.number().required(),
    type:Joi.string().required()
})

class UserController{
    //Register
    createUser = async(req:Request,res:Response)=>{
        try{
            const {value,error} = PostBody.validate(req.body,{abortEarly:false})
            const {firstName,lastName,email,username,password,phonenumber,isadmin,image,country,state,city,addresses,zipcode,type} = value
            const emailval = await UserServices.getusersByemail(email)
            const usernameval = await UserServices.getUserByUsername(username)
            if(error){
                res.status(401).json({message: error.details[0].message})
                return
            }
            if (usernameval) {
                res.status(401).json({ message: "User already exist" })
                return
            }
            if(emailval){
                res.status(401).json({message:"Email already exist"})
            }
            const user = await UserServices.createUser({firstName,lastName,email,username,password,phonenumber,image,isadmin},{country,state,city,addresses,zipcode,type})
            res.status(200).send(user)
        }catch(error){
            console.log("Error",error)
        }
    }
    //login
    loginUser = async (req: LoginRequest, res: any) => {
        const { username, password } = req.body;
        try {
            const user = await UserServices.getUserByUsername(username);
            if (!user) {
              return res.status(400).json({ message: 'Invalid Username' });
            }
            const passwordMatch = await compare(password, user.password as string);
            if (passwordMatch) {
              const payload = { _id: user._id };
              const jwtToken = sign(payload, secret_token, { expiresIn: '1h' });
              return res.status(200).json({ jwtToken, admin: user.isadmin });
            } else {
              return res.status(400).json({ message: 'Invalid Password' });
            }
          } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Server Error' });
          }
      };
      
    //forgetpassword
    forgetUser = async (req: any, res: any) => {
        try {
            const { email } = req.body;
            const emailverify = await UserServices.getusersByemail(email);
            if (emailverify) {
                let otp = Math.floor(1000 + Math.random() * 9000);
                const mailOptions = {
                    from: dotenv.gmail,
                    to: `${email}`,
                    subject: "Password reset OTP",
                    text: `Your OTP is: ${otp}`,
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        emailstore.unshift(email);
                        otp_store.unshift(otp.toString());
                        res.json({ data: `OTP has been sent to ${email}` });
                    }
                });
            } else {
                return res.status(401).json({ message: "Invalid email" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server error during OTP generation" });
        }
    }
    //confirmpassword
    confirmpassword = async (req: any, res: any) => {
        const { newpassword, confirmpassword } = req.body;
    
        try {
            // Fetch the email from the stored email list (from the forget password flow)
            let email1 = emailstore[0];
            if (!email1) {
                return res.status(400).json({ message: "Email is not found in the current session." });
            }
    
            // Check if new password is at least 8 characters
            if (newpassword.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long." });
            }
    
            // Ensure password is strong (includes at least one uppercase, one lowercase, and one number)
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newpassword)) {
                return res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, and one number." });
            }
    
            // Verify if the email exists in the database
            const emailverify = await UserServices.getusersByemail(email1);
            if (!emailverify) {
                return res.status(404).json({ message: "User with this email does not exist." });
            }
    
            // Check if the new password is the same as the current password
            const isSamePassword = await compare(newpassword, emailverify.password);
            if (isSamePassword) {
                return res.status(400).json({ message: "You have entered your old password. Please use a different password." });
            }
    
            // Ensure new password and confirm password match
            if (newpassword !== confirmpassword) {
                return res.status(400).json({ message: "New password and confirm password do not match." });
            }
    
            // Proceed with updating the password in the database
            const updatedResult = await UserServices.updatepassword(email1, newpassword,confirmpassword);
    
            if (updatedResult) {
                // If the password was successfully updated, clear the OTP store and email store
                otp_store = [];
                emailstore = [];
                return res.status(200).json({ message: "Password updated successfully." });
            } else {
                return res.status(500).json({ message: "Failed to update password. Please try again." });
            }
    
        } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ message: "An error occurred while updating the password." });
        }
    }
    //resetpassword
    resetpassword = async (req: Request, res: Response) => {
        try {
            const otp = req.body;
            if (otp.otp === otp_store[0]) {
                res.status(200).json({ message: "Thank you for the OTP" })
            }
            else {
                res.status(401).json({ message: "Give a correct OTP" })
            }
        } catch (error) {
            console.log(error)
        }
    }
    //getusers
    getuserprofile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const profileid = req.profileid;
            if(profileid){
                const profile = profileid.toString()
                const user = await UserServices.getusersByid(profile);
                if (user) {
                    res.status(200).json(user);
                  } else {
                    res.status(404).json({ message: 'User not found' });
                  }
            }
          } catch (error) {
            console.error('Get user profile error:', error);
            res.status(500).json({ message: 'Server Error' });
          }
    }
    //update user
    updateuser = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if(req.profileid !== undefined){
                const idinobjectId = req.profileid;
                const id = idinobjectId.toString()
            const { newfirstName, newlastName, newemail, newusername, newmobilephone, newimage } = req.body
            const updateduser = await UserServices.updateuser(id, newfirstName, newlastName, newemail, newusername, newmobilephone, newimage)
            if (updateduser) {
                res.status(200).json({ message: "User updated successfully" })
            }
            }
        } catch (error) {
            console.log(error)
        }
    }
    //create a new plan from admin
    createplan = async(req:Request,res:Response)=>{
        try {
            const {name,description,image,start,end} = req.body
            if(image === ""){
                res.status(401).json({message:"Give a image"})
                return
            }
            const plan = await UserServices.createplans({name,description,image,start,end})
            res.status(200).send(plan)
        } catch (error) {
            console.log(error)
        }
    }
    //getplan from user side
    getplan = async(req:Request,res:Response)=>{
        try {
            const plans = await UserServices.getplans();
            res.send(plans)
        } catch (error) {
            console.log(error)
        }
    }
    //get plan by id 
    getplanid = async(req:Request,res:Response)=>{
        try {
            const planid = parseInt(req.params.planId,10)
            const plan = await UserServices.getplanbyid(planid)
            if(plan){
                res.json(plan)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const UserControllers = new UserController()