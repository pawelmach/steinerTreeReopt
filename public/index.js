"use strict";
// const graph = parse(Graph, gexf);
const socket = io();
let graph;
socket.on('connection', data => {
    console.log('hello there');
    graph = data;
    console.log(data);
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
// Retrieve some useful DOM elements:
const container = document.getElementById("sigma-container");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");
const labelsThresholdRange = document.getElementById("labels-threshold");
// Instanciate sigma:
if (graph) {
}
