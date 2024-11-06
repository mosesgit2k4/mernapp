import { Server } from 'socket.io';
import { loginadminnotify } from '../service/interface';

let io: Server;

export function initSocket(server: any) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
    console.log("Socket Initialized");

    io.on('connection', (socket) => {
        console.log('Admin connected to socket');

        socket.on('disconnect', () => {
            console.log('Admin disconnected');
        });
    });
}

export function notifyadminforlogin(data: loginadminnotify) {
    if (io) {
        io.emit('userLoggedin', data);
    }
}
