import { Cache } from 'hexo-util';
type Entry = 'head_begin' | 'head_end' | 'body_begin' | 'body_end';
type Store = {
    [key in Entry]: {
        [key: string]: Set<string>;
    };
};
/**
 * An injector is used to add static code snippet to the `<head>` or/and `<body>` of generated HTML files.
 * Hexo run injector before `after_render:html` filter is executed.
 */
declare class Injector {
    store: Store;
    cache: InstanceType<typeof Cache>;
    page: any;
    constructor();
    list(): Store;
    get(entry: Entry, to?: string): any[];
    getText(entry: Entry, to?: string): string;
    getSize(entry: Entry): number;
    register(entry: Entry, value: string | (() => string), to?: string): void;
    _getPageType(pageLocals: any): string;
    _injector(input: string, pattern: string | RegExp, flag: Entry, isBegin: boolean, currentType: string): string;
    exec(data: string, locals?: {
        page: {};
    }): string;
}
export = Injector;
