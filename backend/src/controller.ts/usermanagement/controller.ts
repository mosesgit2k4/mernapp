import { Response, Request } from "express";
import { UserServices, PlanServices } from "../../service/service";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken'
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
    createUser = async (req: Request, res: Response) => {
        try {
            const { value, error } = PostBody.validate(req.body, { abortEarly: false })
            const { firstName, lastName, email, username, password, phonenumber, isadmin, image, country, state, city, addresses, zipcode, type } = value
            const emailval = await UserServices.getusersByemail(email)
            const usernameval = await UserServices.getUserByUsername(username)
            if (error) {
                res.status(401).json({ message: error.details[0].message })
                return
            }
            if (usernameval) {
                res.status(401).json({ message: responsemessage.userexist })
                return
            }
            if (emailval) {
                res.status(401).json({ message: responsemessage.emailexist })
            }
            const user = await UserServices.createUser({ firstName, lastName, email, username, password, phonenumber, image, isadmin }, { country, state, city, addresses, zipcode, type })
            res.status(200).send(user)
        } catch (error) {
            console.log("Error", error)
        }
    }
    //login
    loginUser = async (req: LoginRequest, res: any) => {
        const { username, password } = req.body;
        try {
            const user = await UserServices.getUserByUsername(username);
            if (!user) {
                return res.status(400).json({ message: responsemessage.invalidusername });
            }
            const passwordMatch = await compare(password, user.password as string);
            if (passwordMatch) {
                const payload = { _id: user._id };
                const jwtToken = sign(payload, secret_token, { expiresIn: '1h' });
                return res.status(200).json({ jwtToken, admin: user.isadmin });
            } else {
                return res.status(400).json({ message: responsemessage.invalidpassword });
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: responsemessage.servererror });
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
                return res.status(401).json({ message: responsemessage.invalidemail });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: responsemessage.otpnotgenerating });
        }
    }
    //confirmpassword
    confirmpassword = async (req: any, res: any) => {
        const { newpassword, confirmpassword } = req.body;

        try {

            let email1 = emailstore[0];
            if (!email1) {
                return res.status(400).json({ message: responsemessage.emailnotfound });
            }

            if (newpassword.length < 8) {
                return res.status(400).json({ message: responsemessage.passwordlength });
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newpassword)) {
                return res.status(400).json({ message: responsemessage.passwordcharacters });
            }

            const emailverify = await UserServices.getusersByemail(email1);
            if (!emailverify) {
                return res.status(404).json({ message: responsemessage.invalidemail });
            }

            const isSamePassword = await compare(newpassword, emailverify.password);
            if (isSamePassword) {
                return res.status(400).json({ message: responsemessage.samepassworderrror });
            }

            if (newpassword !== confirmpassword) {
                return res.status(400).json({ message: responsemessage.newandconfirmpassworderror });
            }

            const updatedResult = await UserServices.updatepassword(email1, newpassword, confirmpassword);

            if (updatedResult) {
                otp_store = [];
                emailstore = [];
                return res.status(200).json({ message: responsemessage.passwordupdated });
            } else {
                return res.status(500).json({ message: responsemessage.passwordupdfailure });
            }

        } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ message: responsemessage.passwordupderror });
        }
    }
    //resetpassword
    resetpassword = async (req: Request, res: Response) => {
        try {
            const otp = req.body;
            if (otp.otp === otp_store[0]) {
                res.status(200).json({ message: responsemessage.otpverified })
            }
            else {
                res.status(401).json({ message: responsemessage.otpfailure })
            }
        } catch (error) {
            console.log(error)
        }
    }
    //getusers
    getuserprofile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const profileid = req.profileid;
            if (profileid) {
                const profile = profileid.toString()
                const user = await UserServices.getusersByid(profile);
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: responsemessage.usernotfound });
                }
            }
        } catch (error) {
            console.error('Get user profile error:', error);
            res.status(500).json({ message: responsemessage.servererror });
        }
    }
    //update user
    Updateuser = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (req.profileid !== undefined) {
                const idinobjectId = req.profileid;
                const id = idinobjectId.toString()
                const { newfirstName, newlastName, newemail, newusername, newmobilephone, newimage } = req.body
                const updateduser = await UserServices.updateuser(id, newfirstName, newlastName, newemail, newusername, newmobilephone, newimage)
                if (updateduser) {
                    res.status(200).json({ message: responsemessage.userupdated });
                } else {
                    res.status(404).json({ message: responsemessage.usernotfound });
                }
            } else {
                res.status(400).json({ message: responsemessage.profileidmissing });

            }
        } catch (error) {
            console.log(error)
        }
    }
}
class PlanController {
    //create a new plan from admin
    createplan = async (req: Request, res: Response) => {
        try {
            const { name, description, image, start, end } = req.body
            if (image === "") {
                res.status(401).json({ message: responsemessage.imagefailure })
                return
            }
            const plan = await PlanServices.createplans({ name, description, image, start, end })
            res.status(200).send(plan)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: responsemessage.servererror })
        }
    }
    //getplan from user side
    getplan = async (req: Request, res: Response) => {
        try {
            const plans = await PlanServices.getplans();
            res.send(plans)
        } catch (error) {
            console.log(error)
        }
    }
    //get plan by id 
    getplanid = async (req: Request, res: Response) => {
        try {
            const planid = parseInt(req.params.planId, 10)
            const plan = await PlanServices.getplanbyid(planid)
            if (plan) {
                res.json(plan)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const UserControllers = new UserController()
export const PlanControllers = new PlanController()