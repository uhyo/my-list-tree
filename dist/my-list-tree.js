(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.MyListTree = {})));
}(this, (function (exports) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

/**
 * Turn an element into a tree.
 * @param elm an element.
 */
function treeify(elm, options, nonroot, lastchild) {
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
    if (nonroot === void 0) { nonroot = false; }
    if (lastchild === void 0) { lastchild = false; }
    var childNodes = elm.childNodes, doc = elm.ownerDocument;
    var label = undefined;
    var ul = undefined;
    for (var i = 0; i < childNodes.length; i++) {
        var child = childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'UL') {
            // ラベルの範囲
            label = doc.createRange();
            label.setStartBefore(childNodes[0]);
            label.setEndBefore(child);
            ul = child;
            break;
        }
    }
    if (label == null) {
        // これはleafだよ
        label = doc.createRange();
        label.selectNodeContents(elm);
    }
    // labelを包む
    var labelNode = doc.createElement('div');
    labelNode.classList.add(options.labelMain);
    label.surroundContents(labelNode);
    var labelWrapperNode = doc.createElement('div');
    labelWrapperNode.classList.add(options.label);
    if (nonroot) {
        labelWrapperNode.classList.add(options.labelNonRoot);
    }
    if (lastchild) {
        labelWrapperNode.classList.add(options.labelLastChild);
    }
    label.surroundContents(labelWrapperNode);
    // 横線を追加
    if (nonroot) {
        var liner = doc.createElement('div');
        liner.classList.add(options.labelLine);
        labelWrapperNode.insertBefore(liner, labelWrapperNode.firstChild);
    }
    // ulも包む
    if (ul != null) {
        var ulNode = doc.createElement('div');
        ulNode.classList.add(options.children);
        elm.replaceChild(ulNode, ul);
        ulNode.appendChild(ul);
        // ulの各childに再帰的に適用
        var childNodes_1 = ul.childNodes;
        var noforwardsibling = true;
        for (var i = childNodes_1.length - 1; i >= 0; i--) {
            var child = childNodes_1[i];
            if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'LI') {
                var nobranch = child.classList.contains(options.noBranchClass);
                var lastchild_1 = !nobranch && noforwardsibling;
                if (lastchild_1) {
                    child.classList.add(options.liLastChild);
                }
                if (noforwardsibling) {
                    child.classList.add(options.liNoForwardSibling);
                }
                treeify(child, options, true, lastchild_1);
                if (!nobranch) {
                    noforwardsibling = false;
                }
            }
        }
    }
}

/**
 * Write default CSS.
 * @param options options.
 */
function writeCSS(options, doc) {
    var css = cssText(options);
    var style = doc.createElement('style');
    style.textContent = css;
    doc.head.appendChild(style);
}
function cssText(options) {
    return "\ndiv." + options.children + " {\n    margin: 0 0 0 " + options.indentTree + ";\n}\ndiv." + options.labelNonRoot + " + div." + options.children + " {\n    margin-left: calc(" + options.indentTree + " + " + options.indentChildren + ");\n}\ndiv." + options.children + " > ul {\n    list-style-type: none;\n    margin: 0;\n    padding: 0;\n}\ndiv." + options.children + " > ul > li {\n    border-left: 1px solid black;\n    padding: 0 0 0.4em 0;\n}\ndiv." + options.children + " > ul > li." + options.liNoForwardSibling + " {\n    border-left: none;\n}\ndiv." + options.label + " {\n    display: flex;\n}\ndiv." + options.labelLine + " {\n    align-self: flex-start;\n    width: " + options.indentChildren + ";\n    border-bottom: 1px solid black;\n    transform: translate(0, calc(0.5em + " + options.labelTopPadding + "));\n}\nli." + options.noBranchClass + " div." + options.labelLine + " {\n    border-bottom: none;\n}\nli." + options.liLastChild + " > div." + options.label + " > div." + options.labelLine + " {\n    border-left: 1px solid black;\n    height: calc(0.5em + " + options.labelTopPadding + ");\n    transform: none;\n}\ndiv." + options.labelNonRoot + " div." + options.labelMain + " {\n    padding: " + options.labelTopPadding + " 0 0 0;\n}\n";
}

/**
 * Treeify all nodes that match given selector.
 * @param selector selector.
 * @param options options.
 * @param [doc] document.
 */
function run(selector, options, doc) {
    if (doc === void 0) { doc = document; }
    if (options == null) {
        options = {};
    }
    var options2 = getOptions(options);
    var elms = doc.querySelectorAll(selector);
    for (var i = 0; i < elms.length; i++) {
        treeify(elms[i], options2);
    }
    writeCSS(options2, doc);
}
/**
 * assign default values to options.
 * @param options possibly partial options.
 * @returns full options.
 */
function getOptions(options) {
    var prefix = randomString();
    return __assign({ noBranchClass: '${prefix}-no-branch', label: prefix + "-label", labelMain: prefix + "-label-main", labelNonRoot: prefix + "-label-non-root", labelLastChild: prefix + "-label-last-child", labelLine: prefix + "-label-line", children: prefix + "-children", liLastChild: prefix + "-tree-li-last-child", liNoForwardSibling: prefix + "-label-no-forward-sibling", indentTree: '1em', indentChildren: '3em', labelTopPadding: '0.2em' }, options);
}
/**
 * Generate short random string.
 */
function randomString() {
    return 't' + Math.random().toString(36).slice(2);
}

exports.treeify = treeify;
exports.run = run;

Object.defineProperty(exports, '__esModule', { value: true });

})));
