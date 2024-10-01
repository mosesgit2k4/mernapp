import {Request,Response,NextFunction} from "express"
import {JwtPayload, verify} from "jsonwebtoken"
import { secret_token } from "../config/dotenv";
import User from "../model/usermodel";
import { AuthenticatedRequest } from "./profilehandler";
async function usersSessionHandler(req: AuthenticatedRequest ,res:Response, next:NextFunction){
    const authHeader = req.headers["authorization"]
            let jwtToken
            if(authHeader!=undefined){
                jwtToken = authHeader.split(" ")[1]
            }
            if(jwtToken===undefined){
                res.status(401).json({message:"No JWT Token "})
                return
            }
            else{
                verify(jwtToken, secret_token, async (error: any, payload: any) => {
                    if (error) {
                        res.status(401).json({ message: "Invalid JWT Token" });
                        return 
                    }
                    else {
                        const userdta :any= await User.findOne({where:{id:payload.userid}})
                        if(userdta){
                            req.profileid = userdta.id as string
                            next();
                        }
                        else{
                            res.status(401).json({message:"User not found"})
                        }
                       
                        
                    }
                })
            }
}



export default usersSessionHandler