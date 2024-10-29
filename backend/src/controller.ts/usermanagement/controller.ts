import { Response, Request, NextFunction } from "express";
import { UserServices, PlanServices, TransactionServices } from "../../service/service";
import { compare } from "bcrypt";
import otpGenerator from 'otp-generator'
import { PlanBody } from "../../validation";
import { PostBody } from "../../validation";
import { AuthenticatedRequest } from "../../authHandler/middlewareauthHandler";
import responsemessage from "../../responsemessage";
import CustomError from "../../authHandler/errorhandling";
import { transporter } from "../../service/interface";

class UserController {
    private otpStore: Map<string, { otp: string; expiry: Date }> = new Map();

    // Register a new user
    createUser = async (req: Request, res: Response) => {
        try {
            const { value, error } = PostBody.validate(req.body, { abortEarly: false });
            if (error) {
                throw new CustomError(error.details[0].message, 404);
            }

            const { firstName, lastName, email, username, password, phonenumber, isadmin, image, country, state, city, addresses, zipcode, type } = value;
            const emailExists = await UserServices.getusersByemail(email);
            const usernameExists = await UserServices.getUserByUsername(username);

            if (emailExists) {
                throw new CustomError(responsemessage.emailexist, 409);
            }
            if (usernameExists) {
                throw new CustomError(responsemessage.userexist, 409);
            }

            const user = await UserServices.createUser(
                { firstName, lastName, email, username, password, phonenumber, image, isadmin },
                { country, state, city, addresses, zipcode, type }
            );
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    };

    // Login user
    loginUser = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const user = await UserServices.getUserByUsername(username);
            if (!user) {
                throw new CustomError(responsemessage.invalidusername, 401);
            }

            const jwt = await UserServices.loginUser(password, user.password as string, user._id, user.isadmin, user.firstName);
            if (jwt) {
                res.status(200).json(jwt);
            } else {
                throw new CustomError(responsemessage.invalidpassword, 401);
            }
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    };

    // Forget password (generate OTP)
    forgetUser = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const emailExists = await UserServices.getusersByemail(email);

            if (emailExists) {
                const otp = otpGenerator.generate(4, {lowerCaseAlphabets:false, upperCaseAlphabets:false , specialChars: false });
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

                this.otpStore.set(email, { otp, expiry: otpExpiry });

                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: "Password reset OTP",
                    text: `Your OTP is: ${otp}`,
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.log(err);
                        throw new CustomError('Failed to send OTP', 500);
                    } else {
                        res.status(200).json({ message: `OTP has been sent to ${email}` });
                    }
                });
            } else {
                throw new CustomError(responsemessage.invalidemail, 401);
            }
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    };

    // Reset password (verify OTP)
    resetpassword = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            const storedOtpData = this.otpStore.get(email);

            if (!storedOtpData) {
                throw new CustomError(responsemessage.otpfailure, 400);
            }

            const { otp: storedOtp, expiry } = storedOtpData;
            const currentTime = new Date();

            if (storedOtp === otp && currentTime < expiry) {
                this.otpStore.delete(email); // Clear OTP after verification
                res.status(200).json({ message: responsemessage.otpverified });
            } else {
                throw new CustomError(responsemessage.otpfailure, 400);
            }
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    }
        getuserprofile = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
            try {
                const profileid = req.profileid;
                if (profileid) {
                    const profile = profileid.toString()
                    const user = await UserServices.getusersByid(profile);
                    if (user) {
                        res.status(200).json(user);
                    } else {
                        throw new CustomError(responsemessage.usernotfound,404)
                        
                    }
                }
            } catch (error) {
                if (error instanceof CustomError) {
                    res.status(error.statusCode).json({ message: error.message});
                } else {
                    console.error("Error:", error);
                    res.status(500).json({ message: responsemessage.servererror });
                }
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
                        throw new CustomError(responsemessage.usernotfound,404)
                    }
                } else {
                    throw new CustomError(responsemessage.profileidmissing,400)
    
                }
            } catch (error) {
                if (error instanceof CustomError) {
                    res.status(error.statusCode).json({ message: error.message});
                } else {
                    console.error("Error:", error);
                    res.status(500).json({ message: responsemessage.servererror });
                }
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

    // Confirm new password
    confirmpassword = async (req: Request, res: Response) => {
        const { email, newpassword, confirmpassword } = req.body;

        try {
            if (newpassword !== confirmpassword) {
                throw new CustomError(responsemessage.newandconfirmpassworderror, 400);
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newpassword)) {
                throw new CustomError(responsemessage.passwordcharacters, 400);
            }

            const user = await UserServices.getusersByemail(email);
            if (!user) {
                throw new CustomError(responsemessage.invalidemail, 401);
            }

            const isSamePassword = await compare(newpassword, user.password);
            if (isSamePassword) {
                throw new CustomError(responsemessage.samepassworderrror, 400);
            }

            await UserServices.updatepassword(email,confirmpassword, newpassword);
            res.status(200).json({ message: responsemessage.passwordupdated });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    };
}


//Plan Controller
class PlanController {
    //create a new plan from admin
    createplan = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { value, error } = PlanBody.validate(req.body, { abortEarly: false })
            const {image} = value
            if (image === "") {
                throw new CustomError(responsemessage.imagefailure,404)
            }
            const plan = await PlanServices.createplans(value)
            res.status(200).json(plan)
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message});
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
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
    getplanid = async (req: Request, res: Response) => {
        try {
            const {name} = req.body
            const plan =  await PlanServices.getplanbyname(name)
            if(!plan){
                 throw new CustomError(responsemessage.plannotfound,404)
            }
            res.status(200).json(plan)
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message});
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    }
    getplanidforselectedplan = async (req:Request,res:Response)=>{
        try {
            const plan= req.body
            const selectedplan = await PlanServices.getplanidforselectedplan(plan)
            if(selectedplan){
                res.status(200).json(selectedplan)
            }
            else{
                throw new CustomError(responsemessage.plannotfound,404)
            }
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message});
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    }

    
}

//Transaction Controller
class TransactionController {
    // Create transaction
    createtransactions = async (req: Request, res: Response,next:NextFunction) => {
      try {
        const { userid, planid, amount } = req.body;
        const transaction = await TransactionServices.createtransaction({userid,planid,amount});
  
        if (!transaction) {
          throw new CustomError(responsemessage.transactionfailed,400)
        }
  
        res.status(200).json(transaction);
      } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message});
        } else {
            console.error("Error:", error);
            res.status(500).json({ message: responsemessage.servererror });
        }
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
              throw new CustomError(responsemessage.transactionnotfound,400)
            }
            const len = transid.length
            const lasttransaction = transid[len-1]
            if(!lasttransaction||!lasttransaction.planid){
                throw new CustomError(responsemessage.transactionnotfound,400)
            }
            const planid = lasttransaction.planid
            const transaction = await TransactionServices.gettransaction(id2,transid[len -1]._id.toString(),planid.toString())
                if(!transaction){
                   throw new CustomError(responsemessage.transactionfailed,400)
                }
                res.status(200).json(transaction)
           
        }
      } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message});
        } else {
            console.error("Error:", error);
            res.status(500).json({ message: responsemessage.servererror });
        }
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
            throw new CustomError(responsemessage.didnotunsubscribe,400)
           
        }
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message});
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
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
    transactionhistory = async(req:Request,res:Response)=>{
        const {userid} = req.body
        try{
              const transact = await TransactionServices.transactionhistory(userid)  
                if(transact === "No Transaction found"){
                    throw new CustomError(responsemessage.transactionnotfound,404)}
                else{
                    res.status(200).json(transact)
                }
                
            } 
         catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message});
            } else {
                console.error("Error:", error);
                res.status(500).json({ message: responsemessage.servererror });
            }
        }
    }
}
export const UserControllers = new UserController()
export const PlanControllers = new PlanController()
export const TransactionControllers = new TransactionController()
