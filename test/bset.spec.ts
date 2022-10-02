import opt_b from './data/opt_b_set.json';
import Read_Graph from './util/data_loader';
import STPInstance, { NodeSet } from '../src/STPInstance';
import dreyfusWagner from '../src/dreyfus-wagner';

describe('B set OPT testing', () => {

    opt_b.forEach(obj => {

        // let sum = 0;
        // for (let i = 0; i < 500; i++) {

        it(`${obj.test_case} should be optimal`, async () => {

            let test_case = obj.test_case;
            let opt = obj.opt;
            let instance: STPInstance = new STPInstance();
            await Read_Graph(`./test/data/${test_case}.stp`).then(data => {
                instance = data
            });

            let start_time = performance.now();
            let ST = dreyfusWagner(instance);
            let stop_time = performance.now();

            console.log(`Test ${obj.test_case} took ${stop_time - start_time} ms.`)
            // sum += (stop_time - start_time)

            const fs = require('fs');

            fs.writeFileSync(`./test/data/${obj.test_case}-stp.json`, JSON.stringify(ST))

            expect(ST.getAttribute('OPT')).toEqual(opt);
        })

        // }
        // console.log(sum / 500);
    });
})