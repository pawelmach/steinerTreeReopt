// const graph = parse(Graph, gexf);

import { Sigma } from 'sigma';
import * as io from 'socket.io-client';
import AbstractGraph from 'graphology-types';
import { random } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import * as Graph from 'graphology';
import { render } from 'graphology-canvas';


const container = document.getElementById("sigma-container") as HTMLElement;
const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

const socket = io.io();

socket.on('connection', data => {
    console.log('hello there');
    // let graph: AbstractGraph = data;

    let graph = new Graph.DirectedGraph();
    graph.import(data);

    random.assign(graph);

    const settings = forceAtlas2.inferSettings(graph);
    // const fa2Layout = new FA2Layout(graph, { settings: settings })

    forceAtlas2.assign(graph, {
        iterations: 50,
        settings: settings
    });


    console.log(graph)

    const renderer = new Sigma(graph, container, {
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
    });
    const camera = renderer.getCamera();

    // Bind zoom manipulation buttons
    zoomInBtn.addEventListener("click", () => {
        camera.animatedZoom({ duration: 600 });
    });
    zoomOutBtn.addEventListener("click", () => {
        camera.animatedUnzoom({ duration: 600 });
    });
    zoomResetBtn.addEventListener("click", () => {
        camera.animatedReset({ duration: 600 });
    });

    // Bind labels threshold to range input
    labelsThresholdRange.addEventListener("input", () => {
        renderer.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
    });

    // Set proper range initial value:
    labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
});
