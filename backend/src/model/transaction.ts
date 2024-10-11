import mongoose, { Schema } from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userid:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    planid:{
        type:Schema.Types.ObjectId,
        ref:"Plan"
    },
    amount:{
        type:Number,
        required:true
    }
}, {
    timestamps: true
})

const Trans = mongoose.model('Transaction', TransactionSchema)


export default Trans
