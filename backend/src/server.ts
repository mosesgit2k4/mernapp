import { connectDB } from './config/database';
import dotenv from './config/dotenv';
import app from './app';
const PORT = dotenv.PORT
app.listen(PORT, () => {
    connectDB()
    console.log(`Server running ${PORT}`)
})