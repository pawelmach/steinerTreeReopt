import 'jest';
import { NodeSet, SteinerTree } from '../src/STPInstance';
import { SteinerToRegularBinaryTree } from '../src/restrictedST';
import { assert } from 'console';
import { areSameGraphs, areSameGraphsDeep } from 'graphology-assertions';
import { connectedComponents } from 'graphology-components';
import { bfsFromNode, dfsFromNode } from 'graphology-traversal';
import Heap from 'heap';
import restrictedST from '../src/restrictedST';



describe('Steiner Into Binary', () => {

    let st = new SteinerTree();
    st.addNode('a', { terminal: true });
    st.addNode('b', { terminal: true });
    st.addNode('c', { terminal: true });
    st.addNode('d', { terminal: true });
    st.addNode('e', { terminal: true });
    st.addNode('f', { terminal: true });
    st.addNode('g', { terminal: true });
    st.addNode('s1', { terminal: false });
    st.addNode('s2', { terminal: false });
    st.setAttribute('R', new NodeSet(['a', 'b', 'c', 'd', 'e', 'f', 'g']))

    let bt = st.copy();

    st.addEdge('s1', 's2', { weight: 4 });
    st.addEdge('s2', 'g', { weight: 1 });
    st.addEdge('s2', 'f', { weight: 1 });
    st.addEdge('s1', 'a', { weight: 2 });
    st.addEdge('s1', 'b', { weight: 2 });
    st.addEdge('s1', 'c', { weight: 2 });
    st.addEdge('s1', 'd', { weight: 2 });
    st.addEdge('s1', 'e', { weight: 2 });

    bt.addNode('r', { terminal: false });
    bt.addNode('s3', { terminal: false });
    bt.addNode('s4', { terminal: false });
    bt.addNode('s5', { terminal: false });

    bt.addEdge('s1', 'r', { weight: 2 });
    bt.addEdge('s2', 'r', { weight: 2 });
    bt.addEdge('s2', 'f', { weight: 1 });
    bt.addEdge('s2', 'g', { weight: 1 });
    bt.addEdge('s1', 'e', { weight: 2 });
    bt.addEdge('s1', 's3', { weight: 0 });
    bt.addEdge('s3', 's4', { weight: 0 });
    bt.addEdge('s3', 's5', { weight: 0 });
    bt.addEdge('s4', 'a', { weight: 2 });
    bt.addEdge('s4', 'b', { weight: 2 });
    bt.addEdge('s5', 'c', { weight: 2 });
    bt.addEdge('s5', 'd', { weight: 2 });


    it('should convert example Steiner Tree into Regular Binary Tree', () => {
        // let [nt, root] = SteinerToRegularBinaryTree(st);
        // console.log(nt.inspect())
        // console.log(bt.inspect())
        // console.log(root)
        // restrictedST()

        expect(areSameGraphsDeep(st, bt)).toBeTruthy();
    })

    it('should return connected components', () => {
        // st.dropEdge('s1', 's2')
        // console.log(connectedComponents(st));

        dfsFromNode(bt, 'r', (node, attr, depth) => {
            console.log('Node: ' + node + ', depth: ' + depth);
            if (node === 's4') return true;

        })
        assert(true);
    })

    it('should be a max heap', () => {
        let heap = new Heap((a: number, b: number) => a - b);
        heap.push(1)
        heap.push(2)
        heap.push(3)
        heap.push(4)
        heap.push(5)

        expect(heap.pop()).toEqual(1)
    })
})