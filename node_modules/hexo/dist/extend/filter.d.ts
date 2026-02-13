import Promise from 'bluebird';
import { FilterOptions } from '../types';
interface StoreFunction {
    (data?: any, ...args: any[]): any;
    priority?: number;
}
interface Store {
    [key: string]: StoreFunction[];
}
/**
 * A filter is used to modify some specified data. Hexo passes data to filters in sequence and the filters then modify the data one after the other.
 * This concept was borrowed from WordPress.
 */
declare class Filter {
    store: Store;
    constructor();
    list(): Store;
    list(type: string): StoreFunction[];
    register(fn: StoreFunction): void;
    register(fn: StoreFunction, priority: number): void;
    register(type: string, fn: StoreFunction): void;
    register(type: string, fn: StoreFunction, priority: number): void;
    unregister(type: string, fn: StoreFunction): void;
    exec(type: string, data: any, options?: FilterOptions): Promise<any>;
    execSync(type: string, data: any, options?: FilterOptions): any;
}
export = Filter;
