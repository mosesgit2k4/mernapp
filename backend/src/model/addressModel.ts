import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zipcode:{
        type:BigInt,
        required:true
    },
    addresses:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

const Address = mongoose.model('Addresses',AddressSchema)


export default Address