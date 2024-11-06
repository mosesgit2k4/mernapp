import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { router } from './router';
import { initSocket } from './socketHandling/socket';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use('/api', router);

export default server;
