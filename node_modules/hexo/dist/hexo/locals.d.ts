import { Cache } from 'hexo-util';
declare class Locals {
    cache: InstanceType<typeof Cache>;
    getters: Record<string, () => any>;
    constructor();
    get(name: string): any;
    set(name: string, value: any): this;
    remove(name: string): this;
    invalidate(): this;
    toObject(): Record<string, any>;
}
export = Locals;
