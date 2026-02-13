import Promise from 'bluebird';
import type { NodeJSLikeCallback } from '../types';
import type Hexo from '../hexo';
interface StoreFunction {
    (this: Hexo, deployArg: {
        type: string;
        [key: string]: any;
    }): Promise<any>;
}
interface Store {
    [key: string]: StoreFunction;
}
/**
 * A deployer helps users quickly deploy their site to a remote server without complicated commands.
 */
declare class Deployer {
    store: Store;
    constructor();
    list(): Store;
    get(name: string): StoreFunction;
    register(name: string, fn: (this: Hexo, deployArg: {
        type: string;
        [key: string]: any;
    }, callback?: NodeJSLikeCallback<any>) => any): void;
}
export = Deployer;
