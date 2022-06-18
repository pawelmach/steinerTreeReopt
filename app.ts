import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import Graph, { UndirectedGraph } from 'graphology';
import { complete } from 'graphology-generators/classic';

const graph = complete(UndirectedGraph, 20);

const port = 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

server.listen(port, () => {
    console.log('Server started on port 8000');
});

io.on('connection', socket => {
    console.log('hello');
    socket.emit('connection', graph.export());
});