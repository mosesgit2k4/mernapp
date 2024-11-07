import { Server } from 'socket.io';
import { loginadminnotify } from '../service/interface';
import Notification from '../model/notification';
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

export async function notifyadminforlogin(data: loginadminnotify) {
    if (io) {
        io.emit('userLoggedin', data);
        const notificationMessage = `User ${data.username} (ID: ${data.userId}) has logged in.`;
        await Notification.create({ message: notificationMessage });
    }
}
