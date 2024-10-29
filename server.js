const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

io.on('connection', (socket) => {
    console.log('Cliente conectado com ID:', socket.id);

    // Recebe o estado do vídeo de um cliente e retransmite para outros clientes
    socket.on('videoState', (data) => {
        console.log(`Estado do vídeo recebido de ${socket.id}:`, data);
        socket.broadcast.emit('videoState', { ...data, id: socket.id });
    });

    // Recebe o evento de posição do vídeo e retransmite para os outros clientes
    socket.on('videoSeek', (data) => {
        console.log(`Posição do vídeo recebida de ${socket.id}:`, data.currentTime);
        socket.broadcast.emit('videoSeek', { ...data, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Servidor executando em http://localhost:3000');
});
