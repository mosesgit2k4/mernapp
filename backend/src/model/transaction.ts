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
    },
    deleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const Transaction = mongoose.model('Transaction', TransactionSchema)


export default Transaction
