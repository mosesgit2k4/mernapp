import mongoose from 'mongoose'
import dotenv from './dotenv'

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(dotenv.mongo_url)
       console.log("MongoDb Created",conn.connection.host)
    } catch (error) {
        console.log(`${error}`);
        process.exit(1)
    }
}