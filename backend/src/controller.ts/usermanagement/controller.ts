import { Response,Request } from "express";
import { UserServices } from "../../service/service";
import { compare } from "bcrypt";
import {sign} from 'jsonwebtoken'
import Joi from "joi";

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
    })
})

class UserController{
    createUser = async(req:Request,res:Response)=>{
        try{
            const {value,error} = PostBody.validate(req.body,{abortEarly:false})
            const {firstName,lastName,email,username,password,phonenumber,image} = value
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
            const user = await UserServices.createUser(value)
            res.status(200).send(user)
        }catch(error){

        }
    }
}

export const UserControllers = new UserController()