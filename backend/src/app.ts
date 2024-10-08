import express from 'express'
import bodyParser from 'body-parser'
import { router } from './router'
const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use('/api', router)

export default app;