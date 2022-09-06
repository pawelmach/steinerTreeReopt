import { DijkstraSteiner } from '../src/dijkstra-steiner';
import opt_b from './data/opt_b_set.json';
import Read_Graph from './util/data_loader';
import STPInstance, { NodeSet } from '../src/STPInstance';
import { STcost, SteinerTree, NodeID } from '../src/STPInstance';
import { subgraph } from 'graphology-operators';
import dreyfusWagner from '../src/dreyfus-wagner';

describe('B set OPT testing', () => {

    // let opt = [
    //     // opt_b[0],
    //     opt_b[1],
    //     // opt_b[2],
    //     // opt_b[4],
    //     // opt_b[7],
    // ]

    // opt.forEach(obj => {
    let obj = opt_b[2];

    it(`${obj.test_case} should be optimal`, async () => {

        let test_case = obj.test_case;
        let opt = obj.opt;
        let instance: STPInstance = new STPInstance();
        await Read_Graph(`./test/data/${test_case}.stp`).then(data => {
            instance = data
        });
        // console.log(instance.inspect())

        let [edges, cost] = dreyfusWagner(instance);

        let ST = new SteinerTree();

        let nodes: NodeID[] = [];
        edges.forEach(edge => {
            let s = instance.source(edge);
            let t = instance.target(edge);
            nodes.push(s);
            nodes.push(t);
        })

        ST = subgraph(instance, nodes);
        ST = SteinerTree.from(ST);
        ST.setAttribute('OPT', cost);
        const fs = require('fs');

        fs.writeFileSync(`./test/data/${obj.test_case}-stp.json`, JSON.stringify(ST))

        expect(cost).toEqual(opt);
    })
    // })


    // it('shoul be ok', () => {
    //     let graph2 = new STPInstance();
    //     graph2.addNode('a');
    //     graph2.addNode('b');
    //     graph2.addNode('c');
    //     graph2.addNode('d');
    //     graph2.addNode('e');
    //     graph2.addNode('f');
    //     graph2.addNode('g');
    //     graph2.addUndirectedEdge('a', 'b', { weight: 6 })
    //     graph2.addUndirectedEdge('a', 'd', { weight: 2 });
    //     graph2.addUndirectedEdge('a', 'e', { weight: 3 });
    //     graph2.addUndirectedEdge('a', 'f', { weight: 2 });
    //     graph2.addUndirectedEdge('b', 'c', { weight: 5 });
    //     graph2.addUndirectedEdge('b', 'd', { weight: 5 });
    //     graph2.addUndirectedEdge('c', 'd', { weight: 2 });
    //     graph2.addUndirectedEdge('c', 'e', { weight: 3 });
    //     graph2.addUndirectedEdge('c', 'g', { weight: 4 });
    //     graph2.addUndirectedEdge('d', 'e', { weight: 2 });
    //     graph2.addUndirectedEdge('e', 'f', { weight: 4 });
    //     graph2.addUndirectedEdge('e', 'g', { weight: 2 });
    //     graph2.addUndirectedEdge('f', 'g', { weight: 5 });

    //     graph2.setAttribute('R', new NodeSet(['a', 'f', 'c', 'g', 'e', 'd']));

    //     // let ST = DijkstraSteiner(graph2);
    //     // let result = subgraph(graph2, ST);
    //     // console.log(ST)
    //     // let cost = STcost(result);

    //     let res = dreyfusWagner(graph2);
    //     console.log(res)
    // })

    // it('shoul be ok2', () => {
    //     let graph2 = new STPInstance();
    //     graph2.addNode('a');
    //     graph2.addNode('b');
    //     graph2.addNode('c');
    //     graph2.addNode('d');
    //     graph2.addUndirectedEdge('d', 'a', { weight: 6 })
    //     graph2.addUndirectedEdge('d', 'b', { weight: 2 });
    //     graph2.addUndirectedEdge('d', 'c', { weight: 3 });

    //     graph2.setAttribute('R', new NodeSet(['a', 'b', 'c']));

    //     // let ST = DijkstraSteiner(graph2);
    //     // let result = subgraph(graph2, ST);
    //     // console.log(ST)
    //     // let cost = STcost(result);

    //     let res = dreyfusWagner(graph2);
    //     console.log(res)
    // })
})