import {
    Options,
} from './types';

import treeify from './treeify';
import {
    writeCSS,
} from './css';

export {
    treeify,
};

/**
 * Treeify all nodes that match given selector.
 * @param selector selector.
 * @param options options.
 * @param [doc] document.
 */
export function run(selector: string, options: Options, doc: HTMLDocument = document): void{
    const elms = doc.querySelectorAll(selector);
    for (let i = 0; i < elms.length; i++){
        treeify(elms[i] as HTMLElement, options);
    }

    writeCSS(options, doc);
}
