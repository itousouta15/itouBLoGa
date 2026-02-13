import Promise from 'bluebird';
import type { BaseGeneratorReturn, NodeJSLikeCallback, SiteLocals } from '../types';
type ReturnType = BaseGeneratorReturn | BaseGeneratorReturn[];
type GeneratorReturnType = ReturnType | Promise<ReturnType>;
interface GeneratorFunction {
    (locals: SiteLocals, callback?: NodeJSLikeCallback<any>): GeneratorReturnType;
}
type StoreFunctionReturn = Promise<ReturnType>;
interface StoreFunction {
    (locals: SiteLocals): StoreFunctionReturn;
}
interface Store {
    [key: string]: StoreFunction;
}
/**
 * A generator builds routes based on processed files.
 */
declare class Generator {
    id: number;
    store: Store;
    constructor();
    list(): Store;
    get(name: string): StoreFunction;
    register(fn: GeneratorFunction): void;
    register(name: string, fn: GeneratorFunction): void;
}
export = Generator;
