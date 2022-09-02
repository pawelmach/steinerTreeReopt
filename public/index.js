"use strict";
// const graph = parse(Graph, gexf);
exports.__esModule = true;
var sigma_1 = require("sigma");
var io = require("socket.io-client");
var graphology_layout_1 = require("graphology-layout");
var graphology_layout_forceatlas2_1 = require("graphology-layout-forceatlas2");
var Graph = require("graphology");
var container = document.getElementById("sigma-container");
var zoomInBtn = document.getElementById("zoom-in");
var zoomOutBtn = document.getElementById("zoom-out");
var zoomResetBtn = document.getElementById("zoom-reset");
var labelsThresholdRange = document.getElementById("labels-threshold");
var socket = io.io();
socket.on('connection', function (data) {
    console.log('hello there');
    // let graph: AbstractGraph = data;
    var graph = new Graph.DirectedGraph();
    graph["import"](data);
    graphology_layout_1.random.assign(graph);
    var settings = graphology_layout_forceatlas2_1["default"].inferSettings(graph);
    // const fa2Layout = new FA2Layout(graph, { settings: settings })
    graphology_layout_forceatlas2_1["default"].assign(graph, {
        iterations: 50,
        settings: settings
    });
    console.log(graph);
    var renderer = new sigma_1.Sigma(graph, container, {
        minCameraRatio: 0.1,
        maxCameraRatio: 10
    });
    var camera = renderer.getCamera();
    // Bind zoom manipulation buttons
    zoomInBtn.addEventListener("click", function () {
        camera.animatedZoom({ duration: 600 });
    });
    zoomOutBtn.addEventListener("click", function () {
        camera.animatedUnzoom({ duration: 600 });
    });
    zoomResetBtn.addEventListener("click", function () {
        camera.animatedReset({ duration: 600 });
    });
    // Bind labels threshold to range input
    labelsThresholdRange.addEventListener("input", function () {
        renderer.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
    });
    // Set proper range initial value:
    labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
});
