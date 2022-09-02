import STPInstance from './STPInstance';
import { SteinerTree, NodeSet, NodeID } from './STPInstance';
import { assert } from 'console';
import { DijkstraSteiner } from './dijkstra-steiner';
import { subgraph } from 'graphology-operators';

export default function Connect(graph: STPInstance, F: Array<NodeSet>) {

    let instance = STPInstance.from(graph);

    let terminals: Array<NodeID> = [];

    F.forEach((tree, i) => {
        // replacment node for tree
        instance.addNode('tree' + i);
        // for each node in tree from forest F find edges

        tree.forEach(node => {
            let neighbours = instance.neighbors(node).filter(neigbour => !tree.has(neigbour));
            neighbours.forEach(neighbour => {
                let edges = instance.edges(neighbour).filter(edge => tree.has(instance.target(edge)) || tree.has(instance.source(edge)));

                let min_cost = Number.MAX_VALUE;
                let best_edge = '';

                // find edge connected to tree with the lowest cost
                edges.forEach(edge => {
                    let weight = instance.getEdgeAttribute(edge, 'weight');
                    if (weight < min_cost) {
                        min_cost = weight;
                        best_edge = edge;
                    }
                });

                assert('' !== best_edge);
                let weight = instance.getEdgeAttribute(best_edge, 'weight');

                edges.forEach(edge => {
                    instance.dropEdge(edge)
                });

                // add edge replacing connection between neighbouring node and tree
                // use the same key to get that later
                instance.addEdgeWithKey(best_edge, neighbour, 'tree' + i, { weight: weight })
            });
        });

        // delete nodes from tree that are replaced by single node
        tree.forEach(node => {
            instance.dropNode(node);
        });

        terminals.push('tree' + i);
    });

    // find new tree on reduced instance

    if (terminals.length === 0) {
        terminals = Array.from(graph.getAttribute('R'));
    }

    let ST_nodes = Array.from(DijkstraSteiner(instance, terminals, terminals[0]));

    let new_instance = subgraph(instance, ST_nodes);
    let result_edges = new_instance.edges();

    let ST = SteinerTree.from(graph);
    ST.clearEdges();

    result_edges.forEach(edge => {
        let weight = graph.getEdgeAttribute(edge, 'weight');
        let source = graph.source(edge);
        let target = graph.target(edge);

        ST.addEdgeWithKey(edge, source, target, { weight: weight });
    });

    if (F.length !== 0) {
        F.forEach(tree => {
            let nodes = Array.from(tree);
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let weight = graph.getEdgeAttribute(nodes[i], nodes[j], 'weight');
                    let edge = graph.edge(nodes[i], nodes[j]);
                    ST.addEdgeWithKey(edge, nodes[i], nodes[j], { weight: weight });
                }
            }
        });
    }

    return ST;
}