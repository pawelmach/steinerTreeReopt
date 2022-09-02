import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import Graph, { UndirectedGraph } from 'graphology';
import generators from 'graphology-generators';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2Layout from 'graphology-layout-forceatlas2/worker';

// const graph = generators.girvanNewman(Graph, { zOut: 0.1 });

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
    // console.log(graph.export())
    let graph = new Graph();
    graph.addNode(1);
    graph.addNode(2);
    graph.addNode(3);
    graph.addNode(4);
    graph.addNode(5);
    graph.addNode(6);
    graph.addNode(7);

    graph.addEdge(1, 2);
    graph.addEdge(1, 3);
    graph.addEdge(3, 4);
    graph.addEdge(2, 5);
    graph.addEdge(5, 3);
    graph.addEdge(6, 7);
    graph.addEdge(7, 4);
    graph.addEdge(3, 6);
    socket.emit('connection', graph.toJSON());
});