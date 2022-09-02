import Connect from './connect';
import STPInstance, { SteinerTree } from './STPInstance';
import { NodeSet } from './STPInstance';
import { assert } from 'console';

function generate_sets(set: Array<NodeSet>, k: number): Array<Array<NodeSet>> {
    let i: number, j: number, combs: Array<Array<NodeSet>>, head: Array<NodeSet>, tailcombs: Array<Array<NodeSet>>;

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
        tailcombs = generate_sets(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

function cost(S: SteinerTree): number {
    let c = 0;
    S.forEachEdge((edge, attr) => {
        c += attr.weight;
    })
    return c;
}

export function buildST(graph: STPInstance, forest: Set<NodeSet>, h: number) {

    if (forest.size < h) return Connect(graph, []);

    let steiner_tree: SteinerTree | undefined;

    let components = Array.from(forest);
    let comp_sets = generate_sets(components, h);

    comp_sets.forEach(set => {
        let nF = new Set(forest);
        set.forEach(tree => {
            assert(nF.delete(tree));
        });

        let temp = Connect(graph, Array.from(nF));

        if (!steiner_tree || cost(temp) < cost(steiner_tree)) {
            steiner_tree = temp;
        }
    })

    return steiner_tree;
}