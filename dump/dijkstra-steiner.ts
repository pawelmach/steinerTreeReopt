import { UndirectedGraph } from "graphology";

type NodeID = string | number;
type LabelID = number;

type NodeAttributes = {
    terminal: boolean;
    labels: Map<LabelID, NodeLabelAttr>
}

type EdgeAttributes = {
    weight: number;
}

type GraphAttributes = {
    name?: string;
}

export class STPInstance extends UndirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes> {
    constructor() { super() }
}

class NodeLabel {
    node: NodeID;
    label: LabelID;

    constructor(node: NodeID, label: LabelID) {
        this.node = node;
        this.label = label;
    }
}

class NodeLabelAttr {
    l: number
    b: Set<NodeLabel>

    constructor() {
        this.l = Number.POSITIVE_INFINITY;
        this.b = new Set();
    }
}

class Label {
    subset: number[]

    constructor(subset: number[]) {
        this.subset = subset;
    }

    static empty(size: number): Label {
        return new Label(Array(size).fill(0));
    }

    static full(size: number): Label {
        return new Label(Array(size).fill(1));
    }
}

class Labels {
    labels: Map<LabelID, Label> = new Map();
    label_size: number;

    constructor(terminals_size: number) {
        let labels_size = Math.pow(2, terminals_size);
        this.label_size = terminals_size;

        for (let i of Array(labels_size).keys()) {
            this.labels.set(i, new Label(
                [...Array(terminals_size)]
                    .map((_, i) => terminals_size >> i & 1)
            ))
        }
    }

    get(id: number): Label {
        let label = this.labels.get(id)
        return label ? label : Label.empty(this.label_size);
    }

    getIds(): LabelID[] {
        return [...this.labels.keys()];
    }

    createNodeLabels(node: NodeID): NodeLabel[] {
        return [...this.labels.keys()].map(label_id => new NodeLabel(node, label_id));
    }
}

class LabelMap {
    labels: Map<LabelID, Set<NodeID>> = new Map();

    constructor(terminals: NodeID[]) {
        // How many labels = 2^terminals_size -> All possible combinations of nodes
        let labels_size = Math.pow(2, terminals.length);

        // Each label is a number corresponding to which terminals subset it is, subset consist of nodes for which number(label) as binary has its bit == 1
        for (let i of Array(labels_size).keys()) {
            let subset = new Set(this.bits(i, terminals.length).map((bit, i) => bit ? terminals[i] : -1).filter(v => v >= 0));
            this.labels.set(i, subset)
        }
    }
    private bits = (n: number, base: number) => [...Array(base)].map((_, i) => n >> i & 1);
}

function DijkstraSteiner(graph: STPInstance, terminals: NodeID[], root_terminal: NodeID) {
    let source_terminals = new Set(terminals);
    source_terminals.delete(root_terminal);

    // let bits = (n: number, base: number) => [...Array(base)].map((_, i) => n >> i & 1);
    // let gen_all = (n: number) => [...Array(Math.pow(2, n))].map((_, i) => bits(i, n));

    let labels = new Labels(source_terminals.size);

    graph.updateEachNodeAttributes((node, attr) => {

        let node_labels = labels.createNodeLabels(node);
        let new_labels = new Map(
            node_labels.map(nd => {
                let nd_attr = new NodeLabelAttr();

                if (attr.terminal && node != root_terminal) {
                    if (nd.node === nd.label) { }
                }

                return [nd, nd_attr]
            })
        )

        let new_attr = {
            ...attr,
            labels: new Map<LabelID, NodeLabelAttr>()
        }

        return new_attr;
    })

}

function backtrack() {

}

console.log(new Labels(5).get(4))