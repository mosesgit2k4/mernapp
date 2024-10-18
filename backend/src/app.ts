import express from 'express'
import bodyParser from 'body-parser'
import { router } from './router'
import errorHandler from './authHandler/errorhandling'
const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler);
export default app;