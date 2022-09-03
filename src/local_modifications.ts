import restrictedST from './restrictedST';
import STPInstance from './STPInstance';
import { SteinerTree, NodeID, NodeSet } from './STPInstance';
import { buildST } from './buildST';
import { connectedComponents } from 'graphology-components';
import { subgraph } from 'graphology-operators';
import { assert } from 'console';
import { allSimplePaths } from 'graphology-simple-path';

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

    let path: NodeSet = new NodeSet([t]);

    let max_path_length = 1 + Math.ceil(1 / epsilon);
    let steiner_vertices = ST.filterNodes((node, attr) => !attr.terminal && node !== t);
    let terminals = ST.getAttribute('R');

    let possible_paths: NodeID[][] = [];
    steiner_vertices.forEach(v => {
        possible_paths.push(
            ...allSimplePaths(ST, t, v, { maxDepth: max_path_length })
                .filter(path => new NodeSet(path).intersection(terminals).size === 0)
                .filter(path => path.filter(node => ST.degree(node) >= 3).length = path.length)
        );
    });

    possible_paths.forEach(p => {
        if (p.length > path.size) {
            path = new NodeSet(p);
        }
    })

    // forest ST- path
    let temp = SteinerTree.from(ST);
    let path_array = Array.from(path);
    for (let i = 0; i < path_array.length - 1; i++) {
        let edge = temp.findEdge(path_array[i], path_array[i + 1], () => { }) || temp.findEdge(path_array[i + 1], path_array[i], () => { });
        assert(edge);
        temp.dropEdge(edge);
    }
    let trees_of_temp = connectedComponents(temp);
    let forest = trees_of_temp.map(tree => new NodeSet(...tree));
    let verts = new NodeSet(temp.nodes()).intersection(path);

    let Se: NodeSet[] = [];
    verts.forEach(v => {
        let Sv_nodes = forest.find(f => f.has(v)) || new NodeSet();
        assert(Sv_nodes.size !== 0);
        let Sv = subgraph(ST, Sv_nodes);
        //fix restrivtedST span v
        let kSv = restrictedST(instance, Sv, epsilon);
        Se.push(...kSv);
    })

    let S = buildST(instance, new Set(Se), h);

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

export function edgeCostDecrease(instance: STPInstance, ST: SteinerTree, param: number) {
    let epsilon = param / 10;
    let h = 2 * (1 + Math.ceil(1 / epsilon)) * Math.pow(2, 2 * (2 + Math.ceil(1 / epsilon)) * Math.ceil(2 / param));

    let S = ST;


    let max_path_length = 2 * (1 + Math.ceil(1 / epsilon));
    let steiner_vertices = ST.filterNodes((node, attr) => !attr.terminal);
    let terminals = ST.getAttribute('R');

    let Sv_graph = subgraph(ST, steiner_vertices);

    // possible paths are a set of paths from given ST, whickh have up to 
    // 2(1+ Ceil(1/epsilon)) Steiner vertices, whose degrees are >= 3

    let possible_paths: NodeID[][] = [];
    steiner_vertices.forEach(v => {
        steiner_vertices.filter(w => v !== w).forEach(w => {
            possible_paths.push(
                ...allSimplePaths(Sv_graph, w, v, { maxDepth: max_path_length })
                    .filter(path => new NodeSet(path).intersection(terminals).size === 0)
                    .filter(path => path.filter(node => ST.degree(node) >= 3).length = path.length)
            );
        })
    });

    possible_paths.forEach(path => {
        let temp = SteinerTree.from(ST);
        for (let i = 0; i < path.length - 1; i++) {
            let edge = temp.findEdge(path[i], path[i + 1], () => { }) || temp.findEdge(path[i + 1], path[i], () => { });
            assert(edge);
            temp.dropEdge(edge);
        }
        let trees_of_temp = connectedComponents(temp);
        let forest = trees_of_temp.map(tree => new NodeSet(...tree));
        let verts = new NodeSet(temp.nodes()).intersection(new NodeSet(path));

        let Se: NodeSet[] = [];
        verts.forEach(v => {
            let Sv_nodes = forest.find(f => f.has(v)) || new NodeSet();
            assert(Sv_nodes.size !== 0);
            let Sv = subgraph(ST, Sv_nodes);
            //fix restrivtedST span v
            let kSv = restrictedST(instance, Sv, epsilon);
            Se.push(...kSv);
        })

        let S_prim = buildST(instance, new Set(Se), h);
        if (S_prim && cost(S_prim) <= cost(S)) {
            S = S_prim;
        }
    });

    return S;
}