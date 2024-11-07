import EventEmitter from 'events';
import dotenv from '../config/dotenv';
import nodemailer from 'nodemailer'
import { htmlcontent } from '../config/html';
import User from '../model/usermodel';
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.gmail,
        pass: dotenv.password
    }
});


class UserEvents {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();

        // Event listeners
        this.emitter.on('userAdded', (userid: string, email: string, createdtime: string) => {
            const message = {
                from: dotenv.gmail,
                to: email,
                subject: "Congrats on Registering",
                html: htmlcontent
            };
            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info.response);
                }
            });
            console.log("User was created at ", createdtime);
            console.log('New user added for ', userid);
        });

        this.emitter.on('UserLoggedin', (userid: string) => {
            console.log('User Logged in by ', userid);
        });

        this.emitter.on('AdminLoggedin', (userid: string) => {
            console.log('Admin Logged in by ', userid);
        });

        this.emitter.on('Login Time', (name: string, logintime: string) => {
            console.log(`${name} logged in at ${logintime}`);
        });

        this.emitter.on('Forgetpassword', (email: string) => {
            console.log(email, ' has forgotten their password');
        });

        
    }
    
    // Fetch admin emails from the database
    private async getAdminEmails(): Promise<string[]> {
        try {
            const admins = await User.find({ isadmin: 'admin' }, 'email');
            return admins.map(admin => admin.email);
        } catch (error) {
            console.error("Error fetching admin emails: ", error);
            return [];
        }
    }

    UserAdded(userid: string, email: string, createdtime: string): void {
        this.emitter.emit('userAdded', userid, email, createdtime);
    }

    forgetpassword(email: string) {
        this.emitter.emit('Forgetpassword', email);
    }

    Loggedin(userid: string): void {
        this.emitter.emit('UserLoggedin', userid);
    }

    Loggedinadmin(userid: string): void {
        this.emitter.emit('AdminLoggedin', userid);
    }

    logintime(name: string, logintime: string): void {
        this.emitter.emit('Login Time', name, logintime);
    }

    
}


class PlanEvents{
    private  emitplan:EventEmitter;
    constructor(){
        this.emitplan = new EventEmitter();
        this.emitplan.on('Plan Selected',(planid:string)=>{
            console.log("Plan Activated",planid)
        });
    }
    emitPlanActivated(planid:string):void{
        this.emitplan.emit('Plan Selected',planid)
    }

}
class TransactionEvents{
    private emittrans:EventEmitter
    constructor(){
        this.emittrans = new EventEmitter()
        this.emittrans.on('TransactionDone',()=>{
            console.log("Transaction Done Successfully")
        })
        this.emittrans.on('transactiontimedetails',(transactiontime)=>{
            console.log(`${transactiontime}`)
        })
    }
    TransactionAdded(){
        this.emittrans.emit('TransactionDone')
    }
    transactiontime(transactiontime:string){
        this.emittrans.emit('transactiontimedetails',transactiontime)
    }

}
export { UserEvents,PlanEvents,TransactionEvents };

