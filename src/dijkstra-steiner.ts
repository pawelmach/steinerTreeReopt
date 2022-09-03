import { subgraph } from 'graphology-operators';
import dijkstra from 'graphology-shortest-path';
import Heap from 'heap';
import { WeightedGraph, LazyPrimMST } from "js-graph-algorithms";
import { NodeID } from './STPInstance';
import STPInstance from './STPInstance';


interface Edge {
    source: NodeID
    target: NodeID
}

class Label extends Set<NodeID> {
    union(b: Label): Label {
        return new Label([...this, ...b]);
    }

    intersection(b: Label) {
        return new Label([...this].filter(x => b.has(x)));
    }

    equals(b: Label): boolean {
        return this.diffrence(b).size === 0
    }

    diffrence(b: Label): Label {
        return new Label([...this].filter(x => !b.has(x)));
    }
}

class NodeLabel {
    node: NodeID;
    label: Label;
    l: number;
    b: Set<NodeLabel>;
    lower_bound: number = -1;
    is_to_itself: boolean = false;
    is_empty: boolean = false;

    constructor(node: NodeID, label: Label) {
        this.node = node;
        this.label = label;
        this.b = new Set();
        this.l = Number.MAX_VALUE;

        if (label.size === 1 && label.has(node)) {
            this.is_to_itself = true;
        }
        if (label.size === 0) {
            this.is_empty = true;
        }
    }
}

function mst_cost(graph: JsGraphs.WeightedGraph): number {
    let prim = new LazyPrimMST(graph);
    let mst = prim.mst;
    let cost: number = 0;
    mst.forEach(edge => cost += edge.weight);
    return cost;
}

function convertToJSGraph(graph: STPInstance): JsGraphs.WeightedGraph {
    let nodes_no: number = graph.nodes().length;

    let new_graph: JsGraphs.WeightedGraph = new WeightedGraph(nodes_no);
    graph.forEachEdge((edge, attr, source, target) => {
        // maybe problem with source target are strings
        new_graph.addEdge(
            new JsGraphs.Edge(
                Number.parseInt(source),
                Number.parseInt(target),
                attr.weight
            ));
    });

    return new_graph;
}

class ShortestPath {
    source: NodeID
    target: NodeID
    cost: number
    node_path: NodeID[]

    constructor(source: NodeID, target: NodeID, cost: number, node_path: NodeID[]) {
        this.source = source;
        this.target = target;
        this.cost = cost;
        this.node_path = node_path;
    }

    static from(path: NodeID[], cost: number): ShortestPath {
        let source = path[0];
        let target = path[path.length - 1];
        return new ShortestPath(source, target, cost, path);
    }

    static edges(path: NodeID[]): Array<Edge> {
        let result: Edge[] = [];

        for (let i = 0; i < path.length - 1; i++) {
            result.push({ source: path[i], target: path[i + 1] });
        }

        return result;
    }
}


function generateLabels(nodes: Array<NodeID>) {

    let helper = function (set: any[], k: number) {
        let i: number, j: number, combs: any[], head: any[], tailcombs: any[];

        if (k > set.length || k <= 0) {
            return [];
        }
        if (k == set.length) {
            return [set];
        }
        if (k == 1) {
            combs = [];
            for (i = 0; i < set.length; i++) {
                combs.push([set[i]]);
            }
            return combs;
        }
        combs = [];
        for (i = 0; i < set.length - k + 1; i++) {
            head = set.slice(i, i + 1);
            tailcombs = helper(set.slice(i + 1), k - 1);
            for (j = 0; j < tailcombs.length; j++) {
                combs.push(head.concat(tailcombs[j]));
            }
        }
        return combs;
    }

    let k: number, i: number, combs: any[], k_combs: any[];

    combs = [];

    for (k = 1; k <= nodes.length; k++) {
        k_combs = helper(nodes, k);
        for (i = 0; i < k_combs.length; i++) {
            combs.push(k_combs[i]);
        }
    }
    combs.push([])
    return combs.map(comb => new Label(comb));
}

function calculate_lower_bound(graph: STPInstance, v: NodeID, nodes: NodeID[], paths: Map<NodeID, Map<NodeID, { path: NodeID[], cost: number }>>): number {
    let sub = subgraph(graph, nodes);
    let new_graph = convertToJSGraph(sub);
    let mst_I = mst_cost(new_graph);

    //if I has only one node

    let results: number[] = [];

    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let first = paths.get(nodes[i])?.get(v)?.cost || 0;
            let second = paths.get(nodes[j])?.get(v)?.cost || 0;

            results.push(first + second);
        }
    }

    let min_dist = Math.min(...results);

    return min_dist / 2 + mst_I / 2;

}

export function DijkstraSteiner(graph: STPInstance, terminals: NodeID[], root_terminal: NodeID) {

    // Helper function - backtrack
    function backtrack(vi: NodeLabel): Label {
        if (vi.b.size === 1) {
            let edge = graph.edge(vi.node, vi.b[0].node) || '';
            // watchout here bro maybe edge will be split into letters or it will be null
            return new Label([edge]).union(backtrack(vi.b[0]));
        } else {
            return new Label(backtrack(vi.b[0])).union(backtrack(vi.b[1]));
        }
    }

    let source_terminals = new Label(terminals);
    let source_terminals_with_root = new Label(source_terminals);
    source_terminals.delete(root_terminal);

    let fin_VI: NodeLabel;

    let PERM: Set<NodeLabel>;
    let NOT_PERM: Heap<NodeLabel> = new Heap((a, b) => (a.l + a.lower_bound) - (b.l + b.lower_bound))

    // generate all labels
    let labels: Array<Label> = generateLabels(Array.from(source_terminals));
    // maybe Map<NodeID, Array<NodeLabel>>
    // or Map<NodeID, Map<Label, NodeLabel>>
    // let VI_sets: Array<NodeLabel> = [];
    let VI_Map: Map<NodeID, Map<Label, NodeLabel>> = new Map();
    let Node_Labels: Array<NodeLabel> = [];

    // create Node Labels for each vertex
    graph.nodes().forEach(node => {
        labels.forEach(label => {
            let nL = new NodeLabel(node, label);
            if (source_terminals.has(node) && nL.is_to_itself) {
                nL.l = 0;
            }

            if (label.size === 0) {
                nL.l = 0;
            }

            // VI_sets.push(nL)
            let V_I = VI_Map.get(node) || new Map();
            V_I.set(label, nL);
            VI_Map.set(node, V_I);
            Node_Labels.push(nL);
        })
    })

    let full_label = labels.find(l => l.size === source_terminals.size) || new Label(['error']);
    if (full_label[0] === 'error') throw new Error('undefined value when trying to find full label');
    fin_VI = VI_Map.get(root_terminal)?.get(full_label) || new NodeLabel('error', new Label());
    if (fin_VI.node === 'error') throw new Error('undefined value when trying to get final Node Label');

    // keep shortest path as Map<source, Map<target, {path, cost}>>
    // let shortest_paths: Array<ShortestPath> = [];
    let shortest_paths: Map<NodeID, Map<NodeID, { path: NodeID[], cost: number }>> = new Map();

    // calculate distances between vertices and terminals
    source_terminals_with_root.forEach(source => {

        // find all shortest paths from terminal to all other vertices
        // using Dijkstra algorithm and calculate its cost and cashe 
        // the results

        let paths = dijkstra.singleSource(graph, source);

        paths.keys.forEach(target => {
            if (source != target) {
                let cost: number = 0;
                let edges = ShortestPath.edges(paths[target]);

                edges.forEach(edge => {
                    cost += graph.getEdgeAttribute(graph.edge(edge.source, edge.target), 'weight');
                })

                // shortest_paths.push(ShortestPath.from(paths[target], cost))

                let source_paths = shortest_paths.get(source) || new Map();
                source_paths.set(target, { path: paths[target], cost: cost });
                shortest_paths.set(source, source_paths);

            }
        })
    })

    // populate P Set
    PERM = new Set(Node_Labels.filter(vi => vi.is_empty));


    // populate N heap
    Node_Labels
        .filter(vi => vi.is_to_itself && source_terminals.has(vi.node))
        .forEach(vi => {
            // calculate lower bound for first label nodes in N heap
            let lb_label = source_terminals_with_root.diffrence(vi.label);
            let v = vi.node;

            let label_nodes = Array.from(lb_label);

            vi.lower_bound = calculate_lower_bound(graph, v, label_nodes, shortest_paths);
            NOT_PERM.push(vi);
        });



    // main loop
    while (!PERM.has(fin_VI)) {

        // pick label minimazing l(v, I) + L(v, R\I)
        // for now jest pick lowest cost label and calculate its lower bound
        // NON PERM is a heap minimazing, first value has the lowest l + L

        let vi = NOT_PERM.pop() || new NodeLabel('error', new Label());
        if (vi.node === 'error') throw new Error('undefined value poped from Non permament heap');

        PERM.add(vi);
        let v = vi.node;

        graph.forEachNeighbor(v, (neighbor) => {
            let edge = graph.edge(v, neighbor);
            let edge_cost = graph.getEdgeAttribute(edge, 'weight');

            let wi = VI_Map.get(neighbor)?.get(vi.label) || new NodeLabel('error', new Label());
            if (wi.node = 'error') throw new Error('undefined value when getting node label from a map');

            if (vi.l + edge_cost < wi.l && !PERM.has(wi)) {
                wi.l = vi.l + edge_cost;
                wi.b.add(vi);
                wi.lower_bound = calculate_lower_bound(graph, wi.node, Array.from(wi.label), shortest_paths);
                NOT_PERM.push(wi);
            }
        })

        let possible_labels: Array<Label> = generateLabels([...source_terminals.diffrence(vi.label)]);

        PERM.forEach(vj => {
            if (vj.node !== v) return;

            let j_label = possible_labels.find(label => label.equals(vj.label));
            if (j_label) {
                let IJ_label = vj.label.union(vi.label);

                let v_ij = VI_Map.get(v)?.get(IJ_label) || new NodeLabel('error', new Label());
                if (v_ij.node === 'error') throw new Error('undefined value when getting node label from a map');

                if (vi.l + vj.l < v_ij.l && !PERM.has(v_ij)) {
                    v_ij.l = vi.l + vj.l;
                    v_ij.b.add(vi);
                    v_ij.b.add(vj);
                    v_ij.lower_bound = calculate_lower_bound(graph, v, Array.from(v_ij.label), shortest_paths);
                    NOT_PERM.push(v_ij);
                }
            }
        })


    }

    return backtrack(fin_VI);
}

