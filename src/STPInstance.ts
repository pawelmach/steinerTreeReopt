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
    R: NodeSet
    steinerTree: SteinerTree
}

type GraphAttributes = {
    name?: string;
    R: NodeSet;
}

export class KRestrictedST {
    components: Array<NodeSet>;
    total_weight: number;

    constructor(comps: Array<NodeSet>, weight: number) {
        this.components = comps;
        this.total_weight = weight;
    }
}

export class NodeSet extends Set<NodeID> {
    union(b: NodeSet): NodeSet {
        return new NodeSet([...this, ...b]);
    }

    intersection(b: NodeSet) {
        return new NodeSet([...this].filter(x => b.has(x)));
    }

    equals(b: NodeSet): boolean {
        return this.diffrence(b).size === 0;
    }

    diffrence(b: NodeSet): NodeSet {
        return new NodeSet([...this].filter(x => !b.has(x)));
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

    // addTerminalNode(node: NodeID) {
    //     super.addNode(node, { terminal: true });
    //     super.updateAttribute('R', value => value?.add(node) || new NodeSet([node]))
    // }

    // addSteinerNode(node: NodeID) {
    //     super.addNode(node, { terminal: false });
    // }

    // addWeightedEdge(source: NodeID, target: NodeID, weight: number) {
    //     super.addEdge(source, target, { weight: weight });
    // }
}

export default class STPInstance extends UndirectedGraph<NodeAttributes, EdgeAttributes, STPGraphAttributes> {
    constructor() { super() }

    // addTerminalNode(node: NodeID) {
    //     this.addNode(node, { terminal: true });
    //     this.updateAttribute('R', value => value?.add(node) || new NodeSet([node]))
    // }

    // addSteinerNode(node: NodeID) {
    //     this.addNode(node, { terminal: false });
    // }

    // addWeightedEdge(source: NodeID, target: NodeID, weight: number) {
    //     this.addEdge(source, target, { weight: weight });
    // }
}

class FullComponent {
    nodes: NodeSet = new NodeSet()
    k: number = 0
    weight: number = 0

}