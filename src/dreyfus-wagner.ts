import { dijkstra } from 'graphology-shortest-path';
import STPInstance, { NodeID, NodeSet, SteinerTree } from './STPInstance';
import { subgraph } from 'graphology-operators';
import { bfs, bfsFromNode } from 'graphology-traversal';

class Path {
    nodes: NodeID[]
    edges: string[]
    length: number

    constructor(nodes: NodeID[], edges: string[], length: number) {
        this.nodes = nodes;
        this.edges = edges;
        this.length = length;
    }
}

class MST {
    cost: number
    edges: string[]
    Tset: NodeSetID
    v: NodeID

    constructor(v: NodeID, Tset: NodeSetID, edges: string[], cost: number) {
        this.cost = cost;
        this.v = v;
        this.Tset = Tset;
        this.edges = edges;
    }
}

class Decomp {
    T1: NodeSet;
    T2: NodeSet;
    cost: number;

    constructor(T1: NodeSet, T2: NodeSet, cost: number) {
        this.T1 = T1;
        this.T2 = T2;
        this.cost = cost;
    }
}

type PathID = string;
type MID = string;
type NodeSetID = string;

function resolve_m_id(id: MID) {
    return
}
function path_id(v: NodeID, w: NodeID): string {
    return v + ' ' + w;
}
function m_id(v: NodeID, T: NodeSet | NodeID) {
    return v + ' ' + ns_id(T);
}
function ns_id(set: NodeSet | NodeID) {
    if (typeof set === 'string') {
        return set + ' ';
    }
    return Array.from(set).sort().reduce((p, c) => p + c + ' ', '');
}

export default function dreyfusWagner(instance: STPInstance): SteinerTree {

    let V: NodeID[] = instance.nodes();
    let Tm: NodeID[] = Array.from(instance.getAttribute('R'))

    let M: Map<MID, MST> = new Map();
    let Paths: Map<PathID, Path> = new Map();

    // generate all paths
    for (let v of V) {
        for (let w of V) {
            let path = dijkstra.bidirectional(instance, v, w);
            let edges: string[] = []
            let cost = 0;

            for (let i = 0; i < path.length - 1; i++) {
                let edge = instance.edge(path[i], path[i + 1]) || instance.edge(path[i + 1], path[i]) || 'error';
                if (edge === 'error') throw new Error('error edge problem');
                edges.push(edge);
                cost += instance.getEdgeAttribute(edge, 'weight');
            }

            Paths.set(path_id(v, w), new Path(path, edges, cost));
        }
    }

    function UpdateValueofMST(g: STPInstance, q: NodeID, T: NodeSet) {

        if (T.has(q)) {
            let m = M.get(m_id(q, T));
            if (m) {
                m.cost = 0;
            } else throw new Error('DUPA')

        } else {
            let u = OptDecomp(q, T);
            for (let p of V) {
                let path = Paths.get(path_id(p, q));
                let m = M.get(m_id(p, T));
                if (u.cost + (path?.length || 0) < (m?.cost || Infinity)) {
                    if (m) {
                        m.edges = [];
                        m.edges.push(...M.get(m_id(q, u.T1))?.edges || []);
                        m.edges.push(...M.get(m_id(q, u.T2))?.edges || []);
                        m.edges.push(...path?.edges || []);
                        m.cost = u.cost + (path?.length || 0);

                    } else throw new Error('wawa')
                }
            }
        }

    }

    function OptDecomp(q: NodeID, T: NodeSet) {
        let u = Infinity;
        let v = T.pick();

        let all_Tsets = generateSubsets(Array.from(T));
        let T1_sets = all_Tsets.filter(set => set.has(v));
        let best_decomp = new Decomp(new NodeSet, new NodeSet, Infinity);

        for (let T1 of T1_sets) {
            let T2 = T.diffrence(T1);
            let u_prim = (M.get(m_id(q, T1))?.cost || Infinity) + (M.get(m_id(q, T2))?.cost || Infinity)
            if (u_prim < u) {
                u = u_prim;
                best_decomp = new Decomp(T1, T2, u);
            }
        }
        return best_decomp;
    }

    // main function body
    for (let v of V) {
        for (let t of Tm) {
            let path = Paths.get(path_id(v, t));
            if (path) {
                M.set(m_id(v, t), new MST(v, ns_id(t), Array.from(path.edges), path.length));
            }
        }
    }

    let root: NodeID = Tm[0];
    let P = generateSubsets(Tm.slice(1));

    for (let i = 2; i < Tm.length - 2; i++) {
        let Pi = P.filter(set => set.size === i);
        for (let T of Pi) {
            for (let v of V) {
                M.set(m_id(v, T), new MST(v, ns_id(T), [], Infinity));
            }
            for (let q of V) {
                UpdateValueofMST(instance, q, T);
            }
        }
    }

    let result = new MST(root, ns_id(new NodeSet(Tm)), [], Infinity);
    let t_r = new NodeSet(Tm.slice(1));
    for (let q of V) {
        let u = OptDecomp(q, t_r);
        let path = Paths.get(path_id(root, q));
        if (u.cost + (path?.length || 0) < result.cost) {
            result.cost = u.cost + (path?.length || 0);
            result.edges = [];
            result.edges.push(...M.get(m_id(q, u.T1))?.edges || []);
            result.edges.push(...M.get(m_id(q, u.T2))?.edges || []);
            result.edges.push(...path?.edges || []);
        }
    }

    // console.log(M)

    let ST = new SteinerTree();

    let nodes: NodeID[] = [];
    result.edges.forEach(edge => {
        let s = instance.source(edge);
        let t = instance.target(edge);
        nodes.push(s);
        nodes.push(t);
    })

    ST = subgraph(instance, nodes);
    ST = SteinerTree.from(ST);
    ST.setAttribute('OPT', result.cost);

    let edges = new Set(result.edges);
    let to_remove: string[] = ST.edges().filter(e => !edges.has(e));
    to_remove.forEach(e => {
        ST.dropEdge(e);
    })
    ST.setAttribute('R', Tm);
    return ST;

}


function generateSubsets(nodes: Array<NodeID>) {

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
    // combs.push([])
    return combs.map(comb => new NodeSet(comb));
}