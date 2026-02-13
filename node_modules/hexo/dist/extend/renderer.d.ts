import Promise from 'bluebird';
import type { NodeJSLikeCallback } from '../types';
export interface StoreFunctionData {
    path?: any;
    text?: string;
    engine?: string;
    toString?: any;
    onRenderEnd?: (data: string) => any;
}
export interface StoreSyncFunction {
    (data: StoreFunctionData, options?: object): any;
    output?: string;
    compile?: (data: StoreFunctionData) => (local: any) => any;
    disableNunjucks?: boolean;
    [key: string]: any;
}
export interface StoreFunction {
    (data: StoreFunctionData, options?: object): Promise<any>;
    output?: string;
    compile?: (data: StoreFunctionData) => (local: any) => any;
    disableNunjucks?: boolean;
    [key: string]: any;
}
interface StoreFunctionWithCallback {
    (data: StoreFunctionData, options: object, callback?: NodeJSLikeCallback<any>): Promise<any>;
    output?: string;
    compile?: (data: StoreFunctionData) => (local: any) => any;
    disableNunjucks?: boolean;
    [key: string]: any;
}
interface SyncStore {
    [key: string]: StoreSyncFunction;
}
interface Store {
    [key: string]: StoreFunction;
}
/**
 * A renderer is used to render content.
 */
declare class Renderer {
    store: Store;
    storeSync: SyncStore;
    constructor();
    list(sync?: boolean): Store | SyncStore;
    get(name: string, sync?: boolean): StoreSyncFunction | StoreFunction;
    isRenderable(path: string): boolean;
    isRenderableSync(path: string): boolean;
    getOutput(path: string): string;
    register(name: string, output: string, fn: StoreFunctionWithCallback): void;
    register(name: string, output: string, fn: StoreFunctionWithCallback, sync: false): void;
    register(name: string, output: string, fn: StoreSyncFunction, sync: true): void;
    register(name: string, output: string, fn: StoreFunctionWithCallback | StoreSyncFunction, sync: boolean): void;
}
export default Renderer;
