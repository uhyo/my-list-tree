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
.${options.children} {
    border-left: 1px solid black;
    margin: 0 0 0 1em;
    padding: 0 0 0 2em;
}
.${options.children} > ul {
    list-style-type: none;
    margin: 0;
    padding: 0.6em 0 0 0;
}
.${options.label} {
    margin: 0.6em 0 0 0;
}
.${options.label}--nonroot {
    margin-left: -2em;
}
.${options.label}--line {
    display: inline-block;
    width: 2em;
    border-bottom: 1px solid black;
    transform: translate(0, -0.35em);
}
`;
}
