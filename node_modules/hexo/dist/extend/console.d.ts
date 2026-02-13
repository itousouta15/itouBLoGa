import Promise from 'bluebird';
import type { NodeJSLikeCallback } from '../types';
import type Hexo from '../hexo';
type Option = Partial<{
    usage: string;
    desc: string;
    init: boolean;
    arguments: {
        name: string;
        desc: string;
    }[];
    options: {
        name: string;
        desc: string;
    }[];
}>;
interface Args {
    _: string[];
    [key: string]: string | boolean | string[];
}
type AnyFn = (this: Hexo, args: Args, callback?: NodeJSLikeCallback<any>) => any;
interface StoreFunction {
    (this: Hexo, args: Args): Promise<any>;
    desc?: string;
    options?: Option;
}
interface Store {
    [key: string]: StoreFunction;
}
interface Alias {
    [abbreviation: string]: string;
}
/**
 * The console forms the bridge between Hexo and its users. It registers and describes the available console commands.
 */
declare class Console {
    store: Store;
    alias: Alias;
    constructor();
    /**
     * Get a console plugin function by name
     * @param {String} name - The name of the console plugin
     * @returns {StoreFunction} - The console plugin function
     */
    get(name: string): StoreFunction;
    list(): Store;
    /**
     * Register a console plugin
     * @param {String} name - The name of console plugin to be registered
     * @param {String} desc - More detailed information about a console command
     * @param {Option} options - The description of each option of a console command
     * @param {AnyFn} fn - The console plugin to be registered
     */
    register(name: string, fn: AnyFn): void;
    register(name: string, desc: string, fn: AnyFn): void;
    register(name: string, options: Option, fn: AnyFn): void;
    register(name: string, desc: string, options: Option, fn: AnyFn): void;
}
export = Console;
