// const graph = parse(Graph, gexf);

import Sigma from 'sigma';
import Graph from 'graphology';
import io from 'socket.io-client';

const container = document.getElementById("sigma-container") as HTMLElement;
const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

const socket = io();

socket.on('connection', data => {
    console.log('hello there');
    let graph = data;
    console.log(data)

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
