interface Options {
    min_depth?: number;
    max_depth?: number;
    max_items?: number;
    class?: string;
    class_item?: string;
    class_link?: string;
    class_text?: string;
    class_child?: string;
    class_number?: string;
    class_level?: string;
    list_number?: boolean;
}
/**
 * Hexo TOC helper: generates a nested <ol> list from markdown headings
 * @param {string} str      Raw markdown/html string
 * @param {Options} options Configuration options
 */
declare function tocHelper(str: any, options?: Options): string;
export = tocHelper;
