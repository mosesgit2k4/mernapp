import EventEmitter from 'events';
import { IUser } from '../model/usermodel';
import { ObjectId } from 'mongoose';
class UserEvents {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();

        this.emitter.on('userAdded', (user: IUser) => {
            console.log('New user added:', user);
        });

        this.emitter.on('userFetched', (userid:string) => {
            console.log('Logged in',userid);
        });
        this.emitter.on('Plan Selected',(plan:string)=>{
            console.log("Plan Activated")})
    }

    UserAdded(user: IUser): void {
        this.emitter.emit('userAdded', user);
    }

    Loggedin(userid:string): void {
        this.emitter.emit('userFetched',userid);
    }
    emitPlanActivated(plan:string):void{
        this.emitter.emit('Plan Selected',plan)
    }
}

export { UserEvents };

