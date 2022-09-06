import fs from 'fs'
import * as readline from 'readline';
import events from 'events';
import STPInstance, { NodeSet } from '../../src/STPInstance';
import { assert } from 'console';

const DATA_DIR: string = '../data/'

export default async function Read_Graph(file_name: string): Promise<STPInstance> {

    let instance = new STPInstance();
    let terminals: string[] = []
    let name = '';
    let author = '';

    try {

        const rl = readline.createInterface({
            input: fs.createReadStream(file_name),
            crlfDelay: Infinity
        });


        rl.on('line', line => {

            if (line.startsWith('Name')) {
                name = line.split('"')[1];
            }

            if (line.startsWith('Creator')) {
                author = line.split('"')[1];
            }

            if (line.startsWith('Nodes')) {
                let nodes = Number.parseInt(line.split(' ')[1]);
                for (let i = 1; i <= nodes; i++) {
                    instance.addNode(`${i}`, { terminal: false });
                }
            }

            if (line.startsWith('E ')) {
                let split = line.split(' ');
                let source = split[1];
                let target = split[2];
                let weight = Number.parseFloat(split[3]);

                instance.addEdge(source, target, { weight: weight });
            }

            if (line.startsWith("T ")) {
                let node = line.split(' ')[1];

                terminals.push(node);
                instance.setNodeAttribute(node, 'terminal', true);
            }

        });


        await events.once(rl, 'close');

        instance.setAttribute('name', name + author);
        instance.setAttribute('R', new NodeSet(terminals));

        assert(terminals.length !== 0);

        rl.close();
    } catch (err) {
        console.error(err);
    }

    return instance;
}