import { UndirectedGraph } from "graphology";

export type NodeID = string;

type NodeAttributes = {
    terminal: boolean;
    label?: Label;
    depth?: number;
}

type EdgeAttributes = {
    weight: number;
}

type STPGraphAttributes = {
    name?: string;
    R: NodeSet;
    OPT: number;
}

type GraphAttributes = {
    name?: string;
    R: NodeSet;
    OPT?: number;
}

export class KRestrictedST {
    components: Array<NodeSet>;
    total_weight: number;

    constructor(comps: Array<NodeSet>, weight: number) {
        this.components = comps;
        this.total_weight = weight;
    }
}

export function STcost(S: SteinerTree): number {
    let c = 0;
    S.forEachEdge((edge, attr) => {
        c += attr.weight;
    })
    return c;
}

export class NodeSet extends Set<NodeID> {
    union(b: NodeSet): NodeSet {
        return new NodeSet([...this, ...b]);
    }

    intersection(b: NodeSet) {
        return new NodeSet([...this].filter(x => b.has(x)));
    }

    equals(b: NodeSet): boolean {
        if (this.size !== b.size) {
            return false;
        }

        return Array.from(this).every(element => {
            return b.has(element);
        });
    }

    diffrence(b: NodeSet): NodeSet {
        return new NodeSet([...this].filter(x => !b.has(x)));
    }

    pick(): NodeID {
        return Array.from(this.values())[0];
    }
}

export class Label extends Set<number> {
    constructor(...args: any[]) { super(...args) }

    union(b: Label): Label {
        return new Label([...this, ...b]);
    }

    intersection(b: Label) {
        return new Label([...this].filter(x => b.has(x)));
    }

    equals(b: Label): boolean {
        return this.diffrence(b).size === 0;
    }

    diffrence(b: Label): Label {
        return new Label([...this].filter(x => !b.has(x)));
    }
}

export class SteinerTree extends UndirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes> {
    constructor() { super() }
}

export default class STPInstance extends UndirectedGraph<NodeAttributes, EdgeAttributes, STPGraphAttributes> {
    constructor() { super() }
}
