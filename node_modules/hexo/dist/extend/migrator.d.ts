import Promise from 'bluebird';
import type { NodeJSLikeCallback } from '../types';
import type Hexo from '../hexo';
interface StoreFunction {
    (this: Hexo, args: any): Promise<any>;
}
interface Store {
    [key: string]: StoreFunction;
}
/**
 * A migrator helps users migrate from other systems to Hexo.
 */
declare class Migrator {
    store: Store;
    constructor();
    list(): Store;
    get(name: string): StoreFunction;
    register(name: string, fn: (this: Hexo, args: any, callback?: NodeJSLikeCallback<any>) => any): void;
}
export = Migrator;
