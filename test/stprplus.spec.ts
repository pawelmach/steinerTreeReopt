import 'jest';
import STPInstance, { SteinerTree } from '../src/STPInstance';
import Read_Graph from './util/data_loader';
import my1 from './data/my1-stp.json'
import { steinerVertexToTerminal } from '../src/local_modifications';

import b07 from './data/b07-stp.json';

describe('STP R+', () => {

    // let sum = 0;
    // for (let i = 0; i < 500; i++) {

    it('should work', async () => {
        let instance: STPInstance = new STPInstance();

        await Read_Graph(`./test/data/b07.stp`).then(data => {
            instance = data
        });

        let ST = new SteinerTree();
        ST.setAttribute('OPT', b07.attributes.OPT);
        ST.setAttribute('R', b07.attributes.R);
        b07.nodes.forEach(node => {
            ST.addNode(node.key, node.attributes);
        })
        b07.edges.forEach(edge => {
            ST.addEdgeWithKey(edge.key, edge.source, edge.target, edge.attributes);
        })

        let n_instance = STPInstance.from(instance);
        n_instance.setAttribute('R', [...instance.getAttribute('R'), '19']);
        n_instance.setNodeAttribute('19', 'terminal', true);

        // time measurment
        let start_time = performance.now();
        let res = steinerVertexToTerminal(instance, n_instance, '19', ST, 1.0);
        let stop_time = performance.now();

        console.log(`Test ${test} took ${stop_time - start_time} ms.`)

        // sum += (stop_time - start_time);
        console.log(res?.getAttribute('OPT'));
    })

    // }
    // console.log(sum / 500);

})