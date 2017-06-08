import {
    Options,
} from './types';
/**
 * Write default CSS.
 * @param options options.
 */
export function writeCSS(options: Options, doc: HTMLDocument): void{
    const css = cssText(options);
    const style = doc.createElement('style');
    style.textContent = css;
    doc.head.appendChild(style);
}

function cssText(options: Options): string{
    return `
div.${options.children} {
    margin: 0 0 0 ${options.indentTree};
}
div.${options.labelNonRoot} + div.${options.children} {
    margin-left: calc(${options.indentTree} + ${options.indentChildren});
}
div.${options.children} > ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
div.${options.children} > ul > li {
    border-left: 1px solid black;
    padding: 0 0 0.4em 0;
}
div.${options.children} > ul > li.${options.liLastChild} {
    border-left: none;
}
div.${options.label} {
    display: flex;
}
div.${options.labelLine} {
    align-self: flex-start;
    width: ${options.indentChildren};
    border-bottom: 1px solid black;
    transform: translate(0, calc(0.5em + ${options.labelTopPadding}));
}
li.${options.noBranchClass} div.${options.labelLine} {
    border-bottom: none;
}
li.${options.liLastChild} div.${options.labelLine} {
    border-left: 1px solid black;
    height: calc(0.5em + ${options.labelTopPadding});
    transform: none;
}
div.${options.labelNonRoot} div.${options.labelMain} {
    padding: ${options.labelTopPadding} 0 0 0;
}
`;
}
