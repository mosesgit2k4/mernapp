import EventEmitter from 'events';
import dotenv from '../config/dotenv';
import nodemailer from 'nodemailer'
import { htmlcontent } from '../config/html';
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.gmail,
        pass: dotenv.password
    }
});
let otp_store: string[] = [];
let emailstore: string[] = [];
class UserEvents {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();

        this.emitter.on('userAdded', (userid: string,email:string,createdtime) => {
            const message = {
                from: dotenv.gmail,
                to: `${email}`,
                subject: "Congrats on Registering",
                html:htmlcontent
            }
            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(info.response)
                }
            })
            console.log("User was created at ",createdtime)
            console.log('New user added for ', userid);
        });

        this.emitter.on('UserLoggedin', (userid:string) => {
            console.log('User Logged in by ',userid);
        });
        this.emitter.on('AdminLoggedin',(userid:string)=>{
            console.log('Admin Logged in by ',userid)
        });
        this.emitter.on('Login Time',(name,logintime)=>{
            console.log(`${name}  logged in at ${logintime}`)
        })
        this.emitter.on('Forgetpassword',(email)=>{
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
                    }
                });
        })
    }

    UserAdded(userid: string,email:string,createdtime:string): void {
        this.emitter.emit('userAdded', userid,email,createdtime);
    }
    forgetpassword(email:string){
        this.emitter.emit('Forgetpassword',email)
    }
    Loggedin(userid:string): void {
        this.emitter.emit('UserLoggedin',userid);
    }
    Loggedinadmin(userid:string):void{
        this.emitter.emit('AdminLoggedin',userid)
    }
    logintime(name:string,logintime:string):void{
        this.emitter.emit('Login Time',name,logintime)
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
    }
    TransactionAdded(){
        this.emittrans.emit('TransactionDone')
    }

}
export { UserEvents,PlanEvents,TransactionEvents };

