import dotenv from 'dotenv'

dotenv.config()

export default {
    mongo_url: process.env.MONGO_URL as string,
    PORT: process.env.PORT as string,
    gmail: process.env.GMAIL as string,
    password: process.env.PASSWORD as string
}
export const secret_token = process.env.SECRET_TOKEN as string