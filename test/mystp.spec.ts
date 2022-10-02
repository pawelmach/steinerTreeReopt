import 'jest';
import dreyfusWagner from '../src/dreyfus-wagner';
import STPInstance from '../src/STPInstance';
import Read_Graph from './util/data_loader';


describe('My STP', () => {

    let tests = ['my1', 'my2', 'my3', 'my4']

    tests.forEach(test => {

        // let sum = 0;
        // for (let i = 0; i < 500; i++) {

        it(`should return OPT for ${test}`, async () => {
            let instance: STPInstance = new STPInstance();

            await Read_Graph(`./test/data/${test}.stp`).then(data => {
                instance = data
            });

            let start_time = performance.now();
            let ST = dreyfusWagner(instance);
            let stop_time = performance.now();

            console.log(`Test ${test} took ${stop_time - start_time} ms.`)
            // sum += (stop_time - start_time)

            const fs = require('fs');

            fs.writeFileSync(`./test/data/${test}-stp.json`, JSON.stringify(ST.export()));

            expect(ST.getAttribute('OPT')).toEqual(4);
        })

        // }
        // console.log(sum / 500);
    })
})