export interface Options{
    /**
     * class of node label wrapper.
     */
    label: string;
    /**
     * class of node label.
     */
    labelMain: string;
    /**
     * class of non-root node label.
     */
    labelNonRoot: string;
    /**
     * class of node label which is last child.
     */
    labelLastChild: string;
    /**
     * class of horizontal line.
     */
    labelLine: string;
    /**
     * class of children wrapper.
     */
    children: string;
    /**
     * class of last child li.
     */
    liLastChild: string;
    /**
     * indent of child tree.
     * Should be valid CSS width.
     */
    indentTree: string;
    /**
     * indent of children.
     * Should be valid CSS width.
     */
    indentChildren: string;
    /**
     * padding above each node label.
     * Should be valid CSS length.
     */
    labelTopPadding: string;
}

