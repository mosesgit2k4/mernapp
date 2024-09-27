import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema)


export default User