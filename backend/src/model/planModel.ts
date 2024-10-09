import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    image:{
        data: Buffer,
        contentType: String
      },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Plan = mongoose.model('Plan', PlanSchema)


export default Plan