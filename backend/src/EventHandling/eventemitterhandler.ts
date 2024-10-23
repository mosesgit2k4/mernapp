import EventEmitter from 'events';
class UserEvents {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();

        this.emitter.on('userAdded', (userid: string) => {
            console.log('New user added for ', userid);
        });

        this.emitter.on('userFetched', (userid:string) => {
            console.log('User Logged in by ',userid);
        });
        this.emitter.on('Plan Selected',(planid:string)=>{
            console.log("Plan Activated",planid)
        });
        this.emitter.on('AdminLoggedin',(userid:string)=>{
            console.log('Admin Logged in by ',userid)
        });
        this.emitter.on('TransactionDone',()=>{
            console.log("Transaction Done Successfully")
        })
    }

    UserAdded(userid: string): void {
        this.emitter.emit('userAdded', userid);
    }

    Loggedin(userid:string): void {
        this.emitter.emit('userFetched',userid);
    }
    emitPlanActivated(planid:string):void{
        this.emitter.emit('Plan Selected',planid)
    }
    Loggedinadmin(userid:string):void{
        this.emitter.emit('AdminLoggedin',userid)
    }
    TransactionAdded(){
        this.emitter.emit('TransactionDone')
    }
}

export { UserEvents };

