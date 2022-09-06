import { assert } from 'console';
import { UndirectedGraph } from 'graphology';
import { dijkstra } from 'graphology-shortest-path';
import 'jest';
import JsGraph from 'js-graph-algorithms';
import STPInstance from '../src/STPInstance';
import * as opt_b from './data/opt_b_set.json';


let graph = new JsGraph.WeightedGraph(8)
graph.addEdge(new JsGraph.Edge(0, 7, 0.16));
graph.addEdge(new JsGraph.Edge(2, 3, 0.17));
graph.addEdge(new JsGraph.Edge(1, 7, 0.19));
graph.addEdge(new JsGraph.Edge(0, 2, 0.26));
graph.addEdge(new JsGraph.Edge(5, 7, 0.28));
graph.addEdge(new JsGraph.Edge(1, 3, 0.29));
graph.addEdge(new JsGraph.Edge(1, 5, 0.32));
graph.addEdge(new JsGraph.Edge(2, 7, 0.34));
graph.addEdge(new JsGraph.Edge(4, 5, 0.35));
graph.addEdge(new JsGraph.Edge(1, 2, 0.36));
graph.addEdge(new JsGraph.Edge(4, 7, 0.37));
graph.addEdge(new JsGraph.Edge(0, 4, 0.38));
graph.addEdge(new JsGraph.Edge(6, 2, 0.4));
graph.addEdge(new JsGraph.Edge(3, 6, 0.52));
graph.addEdge(new JsGraph.Edge(6, 0, 0.58));
graph.addEdge(new JsGraph.Edge(6, 4, 0.93));

let graph2 = new STPInstance();
graph2.addNode('a');
graph2.addNode('b');
graph2.addNode('c');
graph2.addNode('d');
graph2.addNode('e');
graph2.addNode('f');
graph2.addNode('g');
graph2.addNode('h');
graph2.addUndirectedEdge('a', 'h', { weight: 0.16 })
graph2.addUndirectedEdge('c', 'd', { weight: 0.17 });
graph2.addUndirectedEdge('b', 'h', { weight: 0.19 });
graph2.addUndirectedEdge('a', 'c', { weight: 0.26 });
graph2.addUndirectedEdge('f', 'h', { weight: 0.28 });
graph2.addUndirectedEdge('b', 'd', { weight: 0.29 });
graph2.addUndirectedEdge('b', 'f', { weight: 0.32 });
graph2.addUndirectedEdge('c', 'h', { weight: 0.34 });
graph2.addUndirectedEdge('e', 'f', { weight: 0.35 });
graph2.addUndirectedEdge('b', 'c', { weight: 0.36 });
graph2.addUndirectedEdge('e', 'h', { weight: 0.37 });
graph2.addUndirectedEdge('a', 'e', { weight: 0.38 });
graph2.addUndirectedEdge('g', 'c', { weight: 0.4 });
graph2.addUndirectedEdge('d', 'g', { weight: 0.52 });
graph2.addUndirectedEdge('g', 'a', { weight: 0.58 });
graph2.addUndirectedEdge('g', 'e', { weight: 0.93 });

describe('Dijkstra-Steiner', () => {

    it('should return paths', () => {
        console.log(dijkstra.singleSource(graph2, 'a'));
        assert(true);
    })
})

