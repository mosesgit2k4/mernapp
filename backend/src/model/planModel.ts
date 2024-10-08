import { string } from "joi";
import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    start:{
        type:Date,
        required:true
    },
    end:{
        type:Date,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Plan = mongoose.model('Plan',PlanSchema)


export default Plan