import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true
    }
}, {
    timestamps: true
})

const Notification = mongoose.model('Notification', NotificationSchema)


export default Notification