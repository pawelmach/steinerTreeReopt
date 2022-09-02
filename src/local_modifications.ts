import restrictedST from './restrictedST';
import STPInstance from './STPInstance';
import { SteinerTree, NodeID, NodeSet } from './STPInstance';
import { buildST } from './buildST';
import { connectedComponents } from 'graphology-components';
import { subgraph } from 'graphology-operators';
import { assert } from 'console';

function cost(S: SteinerTree): number {
    let c = 0;
    S.forEachEdge((edge, attr) => {
        c += attr.weight;
    })
    return c;
}

export function steinerVertexToTerminal(instance: STPInstance, n_instance: STPInstance, t: NodeID, ST: SteinerTree, param: number) {
    let epsilon = param / 10;
    let h = Math.pow(2, 2 * Math.ceil(2 / param) * Math.ceil(1 / epsilon));

    // maybe n_instance in restricted
    let S_epsilon = restrictedST(instance, ST, epsilon);
    let S = buildST(n_instance, new Set([...S_epsilon, new NodeSet([t])]), h)
    return S;
}

export function terminalToSteinerVertex(instance: STPInstance, ST: SteinerTree, t: NodeID, param: number) {
    let epsilon = param / 10;
    let h = (1 + Math.ceil(1 / epsilon)) * Math.pow(2, 2 * (1 + Math.ceil(1 / epsilon) * Math.ceil(2 / param)));

    let kTree: Array<NodeSet> = [];

    let path: Set<NodeID> = new Set([t]);
    let is_more_vertices = true;


    while (is_more_vertices && path.size <= 1 + Math.ceil(1 / epsilon)) {
        let neighbours = ST.filterNeighbors(t, (node, attr) => {
            !path.has(node) && ST.degree(node) >= 3
        })
    }

    let steiner_vertices = ST.filterNodes((node, attr) => !attr.terminal && node !== t);
    steiner_vertices.forEach(v => {
        allSipl
    })


    let S = buildST(instance, new Set(kTree), h)

    if (S && cost(ST) <= cost(S)) {
        return ST;
    }
    return S;
}

export function edgeCostIncrease(instance: STPInstance, ST: SteinerTree, edge: string, param: number) {
    let epsilon = param / 10;
    let h = Math.pow(2, 2 * (1 + Math.ceil(1 / epsilon) * Math.ceil(2 / param)));

    let S: SteinerTree | undefined;

    if (!ST.hasEdge(edge)) {
        S = ST;
    } else {
        let temp_ST = SteinerTree.from(ST);
        temp_ST.dropEdge(edge);

        let connected_comp = connectedComponents(temp_ST);
        let Stree1 = subgraph(ST, connected_comp[0]);
        let Stree2 = subgraph(ST, connected_comp[1]);

        let instance1 = STPInstance.from(instance);
        let instance2 = STPInstance.from(instance);
        instance1.dropEdge(edge);
        instance2.dropEdge(edge);
        instance1.setAttribute('R', instance1.getAttribute('R').intersection(new NodeSet(Stree1.nodes())));
        instance2.setAttribute('R', instance2.getAttribute('R').intersection(new NodeSet(Stree2.nodes())));

        //change restrictedST to include u node from changing edge
        let kTree1 = restrictedST(instance1, Stree1, epsilon);
        let kTree2 = restrictedST(instance2, Stree2, epsilon);

        let S = buildST(instance, new Set([...kTree1, ...kTree2]), h);
        assert(S);

        if (S && cost(ST) <= cost(S)) {
            S = ST;
        }
    }

    return S;
}

export function edgeCostDecrease() { }