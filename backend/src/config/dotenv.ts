import dotenv from 'dotenv'

dotenv.config()

export default {
    mongo_url: process.env.MONGO_URL as string,
    PORT:process.env.PORT as string
}