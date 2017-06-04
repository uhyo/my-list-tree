import {
    Options,
} from './types';

/**
 * Turn an element into a tree.
 * @param elm an element.
 */
export default function treeify(elm: HTMLElement, options: Options): void{
    /**
     * `elm` should have the following structure:
     * <elm>
     *   text
     *   <ul>
     *     <li>child 1</li>
     *     ...
     *   </ul>
     * </elm>
     */

    const {
        children,
        ownerDocument: doc,
    } = elm;
    let label: Range | undefined = undefined;
    let ul: HTMLElement | undefined = undefined;

    for (let i = 0; i < children.length; i++){
        const child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'UL'){
            // ラベルの範囲
            label = doc.createRange();
            label.setStartBefore(children[0]);
            label.setEndBefore(child);
            ul = child as HTMLElement;
            break;
        }
    }
    if (label == null){
        // これはleafだよ
        label = doc.createRange();
        label.selectNodeContents(elm);
    }

    // labelを包む
    const labelNode = doc.createElement('div');
    labelNode.classList.add(options.label);
    label.surroundContents(labelNode);

    // ulも包む
    if (ul != null){
        const ulNode = doc.createElement('div');
        ulNode.classList.add(options.children);
        elm.replaceChild(ulNode, ul);
        ulNode.appendChild(ul);

        // ulの各childに再帰的に適用
        const {
            children,
        } = ul;
        for (let i = 0; i < children.length; i++){
            const child = children[i] as HTMLElement;
            if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'LI'){
                treeify(child, options);
            }
        }
    }
}
