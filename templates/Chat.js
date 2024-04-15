const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Chat.html');
});

const rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (roomCode, username) => {
        socket.join(roomCode);
        if (!rooms[roomCode]) {
            rooms[roomCode] = [];
        }
        rooms[roomCode].push({ id: socket.id, username });
        console.log(`${username} joined room ${roomCode}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg, roomCode) => {
        io.to(roomCode).emit('chat message', { username: getUsername(socket.id, roomCode), message: msg });
    });
});

function getUsername(socketId, roomCode) {
    const members = rooms[roomCode];
    const member = members.find(member => member.id === socketId);
    return member ? member.username : "Unknown";
}

server.listen(8000, () => {
    console.log('listening on *:8000');
});
