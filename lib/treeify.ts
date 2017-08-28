import {
    Options,
} from './types';

/**
 * Turn an element into a tree.
 * @param elm an element.
 */
export default function treeify(elm: HTMLElement, options: Options, nonroot: boolean = false, lastchild: boolean = false): void{
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
        childNodes,
        ownerDocument: doc,
    } = elm;
    let label: Range | undefined = undefined;
    let ul: HTMLElement | undefined = undefined;

    for (let i = 0; i < childNodes.length; i++){
        const child = childNodes[i] as HTMLElement;
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'UL'){
            // ラベルの範囲
            label = doc.createRange();
            label.setStartBefore(childNodes[0]);
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
    labelNode.classList.add(options.labelMain);
    label.surroundContents(labelNode);
    const labelWrapperNode = doc.createElement('div');
    labelWrapperNode.classList.add(options.label);
    if (nonroot){
        labelWrapperNode.classList.add(options.labelNonRoot);
    }
    if (lastchild){
        labelWrapperNode.classList.add(options.labelLastChild);
    }
    label.surroundContents(labelWrapperNode);
    // 横線を追加
    if (nonroot){
        const liner = doc.createElement('div');
        liner.classList.add(options.labelLine);
        labelWrapperNode.insertBefore(liner, labelWrapperNode.firstChild);
    }

    // ulも包む
    if (ul != null){
        const ulNode = doc.createElement('div');
        ulNode.classList.add(options.children);
        elm.replaceChild(ulNode, ul);
        ulNode.appendChild(ul);

        // ulの各childに再帰的に適用
        const {
            childNodes,
        } = ul;

        let noforwardsibling = true;
        for (let i = childNodes.length-1; i >= 0; i--){
            const child = childNodes[i] as HTMLElement;
            if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'LI'){
                const nobranch = child.classList.contains(options.noBranchClass);
                const lastchild = !nobranch && noforwardsibling;
                if (lastchild){
                    child.classList.add(options.liLastChild);
                }
                if (noforwardsibling){
                    child.classList.add(options.liNoForwardSibling);
                }
                treeify(child, options, true, lastchild);

                if (!nobranch){
                    noforwardsibling = false;
                }
            }
        }
    }
}
