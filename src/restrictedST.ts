import STPInstance, { NodeID } from './STPInstance';
import { SteinerTree, NodeSet } from './STPInstance';
import { connectedComponents } from 'graphology-components';
import { subgraph } from 'graphology-operators';
import { assert } from 'console';
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import Heap from 'heap';
import { bfsFromNode, dfsFromNode } from 'graphology-traversal';
import { Label } from './STPInstance';
import { KRestrictedST } from './STPInstance';


function highestPowerOf2(n: number): number {
    let res = 0;
    for (let i = n; i >= 1; i--) {
        if ((i & (i - 1)) == 0) {
            res = i;
            break;
        }
    }
    return res;
}

function* gen_labels(from, to, step = 1, multiplier = 1) {
    for (let i = from; i <= to; i += step) yield i * multiplier === 0 ? i : i * multiplier;
}

function findAncestorOnDepth(tree: SteinerTree, node: NodeID, dest_depth: number): NodeID {
    let cur_depth = tree.getNodeAttribute(node, 'depth') || 0;
    if (cur_depth === dest_depth) return node;

    assert(cur_depth > 0);

    let parent = tree.findNeighbor(node, (_, attr) => attr.depth === cur_depth - 1) || 'error';

    assert(parent !== 'error');

    return findAncestorOnDepth(tree, parent, dest_depth);
}

export function SteinerToRegularBinaryTree(S: SteinerTree): [SteinerTree, NodeID | undefined] {
    let terminals = S.getAttribute('R');
    let vertices = new NodeSet(S.nodes());
    let steiner_vertices = vertices.diffrence(terminals);

    let binaryTree = SteinerTree.from(S);

    // betweenness centrality for root

    let temp_nodes = new NodeSet();
    let root: NodeID | undefined;

    let ST_vert_to_change = Array.from(steiner_vertices).filter(v => S.degree(v) > 3);

    while (ST_vert_to_change.length > 0) {
        let v = ST_vert_to_change.pop();
        let degree = binaryTree.degree(v);

        // case when degree = 2 is probably not considered in metric space
        // should be replaced by a single edge unless its viable as root

        let neighbours = binaryTree.neighbors(v);
        let from_node = neighbours.find(node => !S.getNodeAttribute(node, 'terminal'));
        // err? no from node later
        if (!from_node) root = v;

        let viable_neighbours = neighbours.filter(node => node != from_node);
        // err?

        if (degree === 4) {
            assert(viable_neighbours.length === 3);

            let temp = 'temp' + temp_nodes.size;
            temp_nodes.add(temp);

            binaryTree.addNode(temp, { terminal: false });
            binaryTree.addEdge(v, temp, { weight: 0 });

            for (let i = 0; i < viable_neighbours.length - 1; i++) {
                let weigth: number = binaryTree.getEdgeAttribute(v, viable_neighbours[i], 'weight');
                binaryTree.dropEdge(v, viable_neighbours[i]);
                binaryTree.addEdge(temp, viable_neighbours[i], { weight: weigth });
            }

            if (binaryTree.degree(temp) > 3) ST_vert_to_change.push(temp);

        } else {
            let temp1: NodeID = 'temp' + temp_nodes.size;
            temp_nodes.add(temp1);
            let temp2: NodeID = 'temp' + temp_nodes.size;
            temp_nodes.add(temp2);

            binaryTree.addNode(temp1, { terminal: false });
            binaryTree.addNode(temp2, { terminal: false });

            binaryTree.addEdge(v, temp1, { weight: 0 });
            binaryTree.addEdge(v, temp2, { weight: 0 });

            let cutoff: number = Math.ceil(viable_neighbours.length / 2);

            for (let i = 0; i < viable_neighbours.length; i++) {

                let weigth: number = binaryTree.getEdgeAttribute(v, viable_neighbours[i], 'weight');
                binaryTree.dropEdge(v, viable_neighbours[i]);

                if (i < cutoff) {
                    binaryTree.addEdge(temp1, viable_neighbours[i], { weight: weigth });
                } else {
                    binaryTree.addEdge(temp2, viable_neighbours[i], { weight: weigth });
                }
            }

            if (binaryTree.degree(temp1) > 3) ST_vert_to_change.push(temp1);
            if (binaryTree.degree(temp2) > 3) ST_vert_to_change.push(temp2);
        }
    }
    //assert if every is 3 degree node
    // finding root by creating tree from terminal nodes upwards

    type Centrality = { node: NodeID, value: number };

    let centralities = betweennessCentrality(binaryTree, { getEdgeWeight: null })
    let centralitiesMap: Heap<Centrality> = new Heap((a, b) => b.value - a.value)
    Object.entries(centralities).forEach(entry => centralitiesMap.push({ node: entry[0], value: entry[1] }));

    let temp_root = 'tempRoot';
    binaryTree.addNode(temp_root, { terminal: false });
    let n1 = centralitiesMap.pop()?.node;
    let n2 = centralitiesMap.pop()?.node;

    console.log(n1)
    console.log(n2)
    assert(n1);
    assert(n2);

    let weight = binaryTree.getEdgeAttribute(n1, n2, 'weight');
    binaryTree.dropEdge(n1, n2);
    binaryTree.addEdge(temp_root, n1, { weight: weight / 2 });
    binaryTree.addEdge(temp_root, n2, { weight: weight / 2 });

    root = temp_root;

    // binaryTree = RegularBinaryTree.from(binaryTree);
    // bfsFromNode(binaryTree, root, (key, attr, depth) => {

    // })

    return [binaryTree, root];
}

export default function restrictedST(I: STPInstance, ST: SteinerTree, epsilon: number): Array<NodeSet> {

    let components: Array<NodeSet> = [];

    let k = Math.pow(2, Math.ceil(1 / epsilon));
    let r = highestPowerOf2(k);
    let s = k - Math.pow(2, r);

    // check if steiner tree is a full steiner tree, i.e. all terminals are leaves
    // if not split the tree at terminals that are not trees i.e. degree > 1
    // and call restrictedST on these splitted components then combine results
    // should do helper function to check this only once

    // connected components for splitting the tree

    let split_terminal = ST.findNode((node, attr) => attr.terminal && ST.degree(node) > 1);

    if (split_terminal) {
        let edges = ST.edges(split_terminal);
        let temp = SteinerTree.from(ST);

        // still worry about neighbouring terminals that would create a component

        // Drop all the edges beside one to get a subgraphs
        for (let i = 1; i < edges.length; i++) {
            temp.dropEdge(edges[i]);
        }

        let Stree1: SteinerTree;
        let Stree2: SteinerTree;

        // split the graph
        let connected_comp = connectedComponents(temp);
        if (new Set(connected_comp[0]).has(split_terminal)) {
            Stree1 = subgraph(ST, connected_comp[0]);
            Stree2 = subgraph(ST, [...connected_comp[1], split_terminal]);
        } else {
            Stree1 = subgraph(ST, connected_comp[1]);
            Stree2 = subgraph(ST, [...connected_comp[0], split_terminal]);
        }

        return [...restrictedST(I, Stree1, epsilon), ...restrictedST(I, Stree2, epsilon)]
    }

    // convert to binary tree

    let [binary_tree, root] = SteinerToRegularBinaryTree(ST);
    assert(root);

    // start labeling

    let neighbour_depth: number = 0;
    let j: number = 0;
    let full_label = new Label(...gen_labels(1, r * Math.pow(2, r) + s))

    bfsFromNode(binary_tree, root, (key, attr, depth) => {

        if (neighbour_depth !== depth) {
            neighbour_depth = depth;
            j = 0;
        } else {
            j++;
        }

        attr.depth = depth;

        if (depth == 0) {
            attr.label = new Label(...gen_labels(1, Math.pow(2, r)));
        } else if (depth < r) {
            attr.label = new Label(...gen_labels(1, Math.pow(2, r), 1, depth * Math.pow(2, r)))
        } else {

            // Rule 1
            // get depth - r ancestor, get its label
            // enumerating vertices on this depth
            // set the label 


            // jth descendant only for that node ancestor
            let ancestor = findAncestorOnDepth(binary_tree, key, depth - r);
            let ancestor_label = binary_tree.getNodeAttribute(ancestor, 'label');

            if (!ancestor_label) {
                ancestor_label = new Label();
                throw new Error('ancestor label not found');
            }
            attr.label = new Label();

            for (let i = 0; i < Math.pow(2, r) - s; i++) {
                let l = ancestor_label[(j + i) % Math.pow(2, r)];
                attr.label.add(l)
            }

            // Rule 2
            // add labels that are not in r imidiate ancestors label sets
            let labels_to_add = new Label();
            for (let i = 1; i <= r; i++) {
                let ancestor = findAncestorOnDepth(binary_tree, key, depth - i);
                let ancestor_label = binary_tree.getNodeAttribute(ancestor, 'label');
                if (!ancestor_label) {
                    ancestor_label = new Label();
                    throw new Error('ancestor label not found');
                }
                labels_to_add = labels_to_add.union(ancestor_label);
            }

            labels_to_add = full_label.diffrence(labels_to_add);
            assert(labels_to_add.size === s);

            attr.label = attr.label.union(labels_to_add);
        }
    })

    // Getting components
    // component = from intermidiate leaves to tree leaves
    // the rest is connection between components
    // diffrent numbers give diffrent possibilities
    // you look for one with minimum length
    // filter out the temporary nodes out of component

    let ktrees: Heap<KRestrictedST> = new Heap((a: KRestrictedST, b: KRestrictedST) => a.total_weight - b.total_weight);
    let terminals = binary_tree.getAttribute('R');

    //for each label l
    for (let l = 1; l <= full_label.size; l++) {

        let intermidiate_leaves = binary_tree
            .filterNodes((node, attr) => attr.label?.has(l))
            .filter(node => node !== root && !terminals.has(node));

        let root_comp = new NodeSet();

        dfsFromNode(binary_tree, root, (key, attr, depth) => {
            if (key != root) {
                if (attr.label?.has(l) || attr.terminal) {
                    root_comp.add(key);
                    return true;
                }
            }
        })

        let l_comps: Array<NodeSet> = [];

        root_comp.forEach(node => {
            let new_comp = new NodeSet();
            dfsFromNode(binary_tree, node, (key, attr, depth) => {
                if (attr.depth && attr.depth <= depth) return true;
                if (attr.label?.has(l) || attr.terminal) {
                    new_comp.add(key);
                    return true;
                }
            })
            new_comp.add(node);
            l_comps.push(new_comp);
        })

        let total_weight: number = 0;

        intermidiate_leaves.forEach(node => {
            let weight: number = 0;
            dfsFromNode(binary_tree, node, (key, attr, depth) => {
                if (attr.depth && attr.depth <= depth) {
                    if (!attr.terminal) {
                        let edge_w = binary_tree.getEdgeAttribute(node, key, 'weight');
                        weight += edge_w;
                    } else {
                        total_weight += weight;
                        weight = 0;
                    }
                }
            })
        })

        // filter out the temp nodes
        // if root component has terminals (it shouldnt)
        // l_comps.push(root_comp);
        ktrees.push(new KRestrictedST(l_comps, total_weight));
    }

    return ktrees.pop()?.components || [];
}