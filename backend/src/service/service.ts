import User from '../model/usermodel';
import bcrypt, { compare } from 'bcrypt';
import Address from "../model/addressModel";
import Plan from "../model/planModel";
import responsemessage from '../responsemessage';
import Trans from '../model/transaction';
import { ObjectId } from 'mongoose';
import { PlanEvents, TransactionEvents, UserEvents } from '../EventHandling/eventemitterhandler';
import { secret_token } from '../config/dotenv';
import { sign } from 'jsonwebtoken';
import { CreateAddress,SelectedPlan,CreatePlan,CreateUsers } from './interface';
let transactions:object= []
let selectedPlan: SelectedPlan|null = null
class UserService {
    private userEvents: UserEvents;

    constructor() {
        this.userEvents = new UserEvents();
    }
    // Create a new user and address
    async createUser(userData: CreateUsers, addressData: CreateAddress) {
        try {
            const address = await Address.create(addressData);
            const user = await User.create({ ...userData, addressId: address._id });
            const createdtime = new Date().toISOString()
            this.userEvents.UserAdded(user._id.toString(),user.email,createdtime)
            return user;
        } catch (err) {
            console.log(err);
            return { message: responsemessage.usercreateerror };
        }
    }
    async loginUser(password:string,userpassword:string,userid:ObjectId,userisadmin:string,name:string){
            const passworMatch = await compare(password,userpassword);
        if(passworMatch){
            const payload = {_id:userid};
            const jwtToken = sign(payload,secret_token,{expiresIn:'1h'})
            const loginTime =  new Date().toISOString();
            this.userEvents.logintime(name,loginTime)
            if(userisadmin === "Admin"){
                this.userEvents.Loggedinadmin(userid.toString())
            }
            else{
                this.userEvents.Loggedin(userid.toString())
            }
            return {jwtToken,admin:userisadmin}
        }
    }
    // Get user by ID
    async getusersByid(id: string) {
        try {
            const user = await User.findById(id).lean();
            if (!user) {
                throw new Error(responsemessage.usernotfound)
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.log(error);
            return responsemessage.servererror;
        }
    }

    // Get user by email
    async getusersByemail(email: string) {
        try {
            this.userEvents.forgetpassword(email)
            return  User.findOne({ email }).lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Get user by username
    async getUserByUsername(username: string) {
        try {
            return  User.findOne({ username }).lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Get user by phone number
    async getUsersByphone(mobilephone: number) {
        try {
            return  User.findOne({ mobilephone }).lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Update user password
    async updatepassword(email: string, newpassword: string, confirmpassword: string) {
        if (newpassword !== confirmpassword) {
           throw new Error(responsemessage.passwordnotmatch)
        }
        try {
            const hashedPassword = await bcrypt.hash(newpassword, 10);

            const updateResult = await User.updateOne(
                { email },
                { $set: { password: hashedPassword } }
            );

            if (updateResult.modifiedCount === 0) {
                return null;
            }

            return true;
        } catch (error) {
            console.log(error);
            return 'Error occurred while updating password';
        }
    }


    // Update user details
    async updateuser(id: string, newfirstName: string, newlastName: string, newemail: string, newusername: string, newmobilephone: number, newimage: string) {
        try {
            const update = await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        firstName: newfirstName,
                        lastName: newlastName,
                        email: newemail,
                        username: newusername,
                        phonenumber: newmobilephone,
                        image: newimage
                    }
                },
                { new: true }
            );

            if (!update) {
                return null;
            }
            return update;
        } catch (error) {
            console.log(error);
        }
    }
    async getusers(){
        const users = await User.find({isadmin:"User"}).lean()
        if(!users){
            return 'No Users Till Now'
        }
        return users
    }
}
class PlanService {
    private PlanEvents: PlanEvents;

    constructor() {
        this.PlanEvents = new PlanEvents();}
    // Create a new plan
    async createplans(plansData: CreatePlan) {
        try {
            const plan = await Plan.create(plansData);
            this.PlanEvents.emitPlanActivated(plan._id.toString())
            return plan;
        } catch (error) {
            console.log(error);
            return { message: "There was an error creating the plan" };
        }
    }

    // Get all plans
    async getplans() {
        try {
            const plans = await Plan.find().lean();
            if (!plans) {
                throw new Error(responsemessage.noplanfound);
            }
            return plans;
        } catch (error) {
            console.log("Error:", error);
        }
    }
    //Get plan by id
    async getplanbyid(id: string) {
        try {
            const plan = await Plan.findById(id).lean()
            if (!plan) {
                return responsemessage.plannotfound
            }
            return plan
        } catch (error) {
            console.log("Error:", error)
            return `Error occured`
        }
    }
    //Get plan by name
    async getplanbyname(name:string){
        try {
            const plan = await  Plan.findOne({name})
            if(!plan){
                return responsemessage.plannotfound
            }
            return plan
        } catch (error) {
            console.log("Error",error)
            return 
        }
    }
    async selectplan(plan:SelectedPlan){
        try {
        if(!plan){
            return  responsemessage.plannotfound
        }
        selectedPlan = plan
        return plan
        } catch (error) {
            console.log(error)
            return responsemessage.servererror
        }
    }
    async getselectedplan(){
        try {
            if(selectedPlan){
                return selectedPlan
            }
            else{
                throw new Error("No plan selected")
            }
        } catch (error) {
            console.log(error)
            return responsemessage.servererror
        }
    }

}
class TransactionService {
    private TransactionEvents: TransactionEvents;

    constructor() {
        this.TransactionEvents = new TransactionEvents();}
    // Create transaction
    async createtransaction(transactiondetails: { userid: string; planid: string; amount: number }) {
      try {
        const { userid, planid } = transactiondetails;
  
        const useridverify = await User.findById(userid);
        const planidverify = await Plan.findById(planid);
  
        if (!useridverify || !planidverify) {
          return null; 
        }
  
        const transaction = await Trans.create(transactiondetails);
        this.TransactionEvents.TransactionAdded()
        return transaction;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    }
  
    // Get transaction by ID
    async gettransaction(userid:string,transid:string,planid:string){
        try {
            const user = await Trans.findOne({userid:userid,_id:transid,planid:planid}).lean()
           if(user){
            return user
           }
           return responsemessage.transactionnotfound
        } catch (error) {
            console.log('Error',error)
            return null
        }
    }
    async gettransactionid(userid:string){
        try {
            const transaction  = await Trans.find({userid:userid,deleted:false}).lean()
            if(transaction){
                return transaction
            }
            else{
                return null
            }
        } catch (error) {
            console.log('Error',error)
            return null
        }
    }
    async softdeletetransactionid(id:string){
        try {
            return await Trans.findByIdAndUpdate(id,{deleted:true})
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async latestplan(userid:string){
        try {
            const latestTransaction = await Trans.findOne({ userid: userid, deleted: false })
        .sort({ createdAt: -1 });

    if (!latestTransaction) {
        throw new Error('No active transactions found for this user.');
    }
    const plan = await Plan.findById(latestTransaction.planid);
    if (!plan) {
        throw new Error('Plan not found.');
    }
    return {plan}
        } catch (error) {
            console.log(error)
            return responsemessage.servererror
        }
    }
    async transactionhistory(userid:string){
        try {
            const transactionhistory = await Trans.find({ userid });
      
            if (!transactionhistory || transactionhistory.length === 0) {
              throw new Error('No Transaction found');
            }
      
            
            const plandetails = await Promise.all(
              transactionhistory.map(async (transaction) => {
                const plan = await Plan.findById(transaction.planid).lean();
                const details = { ...transaction.toObject(), 
                    name: plan?.name || 'Unknown Plan',
                    image: plan?.image || 'No Image Available',}
                return details;
              })
            );
      
            transactions = plandetails; 
            return plandetails;
          } catch (error) {
            console.error(error);
            return { message: responsemessage.servererror };
          }
    }
    async transactionhistorydetails(){
        try {
            if(transactions){
                return transactions
            }
        } catch (error) {
            console.log(error)
            return responsemessage.servererror
        }
    }
  }
  
export const UserServices = new UserService();
export const PlanServices = new PlanService()
export const TransactionServices = new TransactionService()