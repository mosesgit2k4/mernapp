import { Response, Request, NextFunction } from "express";
import { UserServices, PlanServices, TransactionServices } from "../../service/service";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken'
import { PlanBody } from "../../validation";
import { PostBody } from "../../validation";
import nodemailer from 'nodemailer'
import dotenv, { secret_token } from "../../config/dotenv";
import { AuthenticatedRequest } from "../../authHandler/middlewareauthHandler";
import responsemessage from "../../responsemessage";

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


class UserController {
    //Register
    createUser = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { value, error } = PostBody.validate(req.body, { abortEarly: false })
            const { firstName, lastName, email, username, password, phonenumber, isadmin, image, country, state, city, addresses, zipcode, type } = value
            const emailval = await UserServices.getusersByemail(email)
            const usernameval = await UserServices.getUserByUsername(username)
            if (error) {
                res.status(401)
                return next(new Error(error.details[0].message)) 
            }
            if (usernameval) {
                res.status(401)
                return next(new Error(responsemessage.userexist))
            }
            if (emailval) {
                res.status(401)
                return next(new Error(responsemessage.emailexist))
            }
            const user = await UserServices.createUser({ firstName, lastName, email, username, password, phonenumber, image, isadmin }, { country, state, city, addresses, zipcode, type })
            res.status(200).json(user)
        } catch (error) {
            console.log("Error", error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
    //login
    loginUser = async (req: LoginRequest, res: any ,next:NextFunction) => {
        const { username, password } = req.body;
        try {
            const user = await UserServices.getUserByUsername(username);
            if (!user) {
                res.status(400)
                return next(new Error(responsemessage.invalidusername))
            }
            const passwordMatch = await compare(password, user.password as string);
            if (passwordMatch) {
                const payload = { _id: user._id };
                const jwtToken = sign(payload, secret_token, { expiresIn: '1h' });
                return res.status(200).json({ jwtToken, admin: user.isadmin });
            } else {
                res.status(400)
                return next( new Error(responsemessage.invalidpassword))
            }
        } catch (error) {
            console.error('Login error:', error);
             res.status(500).json({ message: responsemessage.servererror });
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
                res.status(401)
                throw new Error(responsemessage.invalidemail)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: responsemessage.otpnotgenerating });
        }
    }
    //confirmpassword
    confirmpassword = async (req: any, res: any,next:NextFunction) => {
        const { newpassword, confirmpassword } = req.body;

        try {

            let email1 = emailstore[0];
            if (!email1) {
                 res.status(400)
                 throw new Error(responsemessage.emailnotfound)
            }

            if (newpassword.length < 8) {
                 res.status(400)
                 return next(new Error(responsemessage.passwordlength))
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newpassword)) {
                 res.status(400)
                 return next(new Error(responsemessage.passwordcharacters))
            }

            const emailverify = await UserServices.getusersByemail(email1);
            if (!emailverify) {
                 res.status(404)
                 return next(new Error(responsemessage.invalidemail))
            }

            const isSamePassword = await compare(newpassword, emailverify.password);
            if (isSamePassword) {
                res.status(400)
                return next( new Error(responsemessage.samepassworderrror))
            }

            if (newpassword !== confirmpassword) {
                res.status(400)
                return next(new Error(responsemessage.newandconfirmpassworderror))
            }

            const updatedResult = await UserServices.updatepassword(email1, newpassword, confirmpassword);

            if (updatedResult) {
                otp_store = [];
                emailstore = [];
                 res.status(200).json({ message: responsemessage.passwordupdated });
            } else {
                res.status(400)
                return next(new Error(responsemessage.passwordupdfailure))
            }

        } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ message: responsemessage.passwordupderror });
        }
    }
    //resetpassword
    resetpassword = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const otp = req.body;
            if (otp.otp === otp_store[0]) {
                res.status(200).json({ message: responsemessage.otpverified })
            }
            else {
                res.status(401)
                return next(new Error(responsemessage.otpfailure))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
    //getusers
    getuserprofile = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
        try {
            const profileid = req.profileid;
            if (profileid) {
                const profile = profileid.toString()
                const user = await UserServices.getusersByid(profile);
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404)
                    return next(new Error(responsemessage.usernotfound))
                    
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: responsemessage.servererror });
        }
    }
    //update user
    Updateuser = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
        try {
            if (req.profileid !== undefined) {
                const idinobjectId = req.profileid;
                const id = idinobjectId.toString()
                const { newfirstName, newlastName, newemail, newusername, newmobilephone, newimage } = req.body
                const updateduser = await UserServices.updateuser(id, newfirstName, newlastName, newemail, newusername, newmobilephone, newimage)
                if (updateduser) {
                    res.status(200).json({ message: responsemessage.userupdated });
                } else {
                    res.status(404)
                    return next(new Error(responsemessage.usernotfound))
                }
            } else {
                res.status(400)
                return next(new Error(responsemessage.profileidmissing))

            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
    getallusers = async(req:Request,res:Response)=>{
        try {
            const user = await UserServices.getusers(); 
            res.json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
}
class PlanController {
    //create a new plan from admin
    createplan = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { value, error } = PlanBody.validate(req.body, { abortEarly: false })
            const {image} = value
            if (image === "") {
                res.status(401)
                return next(new Error(responsemessage.imagefailure))
            }
            const plan = await PlanServices.createplans(value)
            res.status(200).json(plan)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: responsemessage.servererror })
        }
    }
    //getplan from user side
    getplan = async (req: Request, res: Response) => {
        try {
            const plans = await PlanServices.getplans();
            res.json(plans)
        } catch (error) {
            console.log(error)
        }
    }
    //get plan by id 
    getplanid = async (req: any, res: any,next:NextFunction) => {
        try {
            const {name} = req.body
            const plan =  await PlanServices.getplanbyname(name)
            if(!plan){
                  res.status(401)
                  return next(new Error(responsemessage.plannotfound))
            }
            res.status(200).json(plan)
        } catch (error) {
            console.log(error)
             res.status(500).json({message:responsemessage.servererror})
        }
    }

    //
    selectplan = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const plan = req.body
            const selectedplan = await PlanServices.selectplan(plan)
            if(selectedplan){
                res.json(selectedplan).status(200)
            }
            else{
                res.status(400)
                return next(new Error(responsemessage.plannotfound))}
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
    selectedplan = async(req:Request,res:Response)=>{
        try {
            const selectplan = await PlanServices.getselectedplan()
            if(selectplan){
                res.status(200).json(selectplan)
            }
        } catch (error) {
            res.status(500).json({message:responsemessage.servererror})
        }
    }
}

class TransactionController {
    // Create transaction
    createtransactions = async (req: Request, res: Response,next:NextFunction) => {
      try {
        const { userid, planid, amount } = req.body;
  
        const transaction = await TransactionServices.createtransaction({ userid, planid, amount });
  
        if (!transaction) {
           res.status(400)
           return next(new Error(responsemessage.transactionfailed))
        }
  
        res.status(200).json(transaction);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: responsemessage.servererror });
      }
    };
  
    // Get transaction by ID
    getransactionbyid = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
      try {
        const  id = req.profileid

        if (id) {
            const id2 = id.toString()
            const transid = await TransactionServices.gettransactionid(id2)
            if(!transid|| transid.length === 0){
               res.status(400)
               return next(new Error(responsemessage.notransaction))
            }
            const len = transid.length
            const lasttransaction = transid[len-1]
            if(!lasttransaction||!lasttransaction.planid){
                res.status(400)
                return next(new Error(responsemessage.invalidtransaction))
            }
            const planid = lasttransaction.planid
            const transaction = await TransactionServices.gettransaction(id2,transid[len -1]._id.toString(),planid.toString())
                if(!transaction){
                    res.status(400)
                    return next(new Error(responsemessage.transactionfailed))
                }
                res.status(200).json(transaction)
           
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: responsemessage.servererror });
      }
    }
    softdeletetransactionid = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id} = req.body
        const softdelete = await TransactionServices.softdeletetransactionid(id)
        if(softdelete){
            res.status(200).json({message:responsemessage.unsubscribesuccefully})
        }
        else{
            res.status(400)
            return next(new Error(responsemessage.didnotunsubscribe))
           
        }
        } catch (error) {
         console.log(error)   
         res.status(500).json(responsemessage.servererror)
        }
    }
    latestplan = async(req:AuthenticatedRequest,res:Response)=>{
        const userid = req.profileid
        try {
            if(userid){
                const userid2 = userid.toString()
                const plan = await TransactionServices.latestplan(userid2)
                if(plan){
                    res.status(200).json(plan)
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
    transactionhistory = async(req:Request,res:Response,next:NextFunction)=>{
        const {userid} = req.body
        try {
                const transactions = await TransactionServices.transactionhistory(userid)
                if(!transactions){
                    return next(new Error("No Transaction"))
                }
                res.status(200).json(transactions)
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
    transactionhistorydetails = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const transactiondetails = await TransactionServices.transactionhistorydetails()
            if(transactiondetails){
                res.status(200).json(transactiondetails)
            }
            else{
                res.status(400)
                return next(new Error(responsemessage.transactionnotfound))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message:responsemessage.servererror})
        }
    }
}
export const UserControllers = new UserController()
export const PlanControllers = new PlanController()
export const TransactionControllers = new TransactionController()
