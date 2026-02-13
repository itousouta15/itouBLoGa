import { Pattern } from 'hexo-util';
import type File from '../box/file';
interface StoreFunction {
    (file: File | string): any;
}
type Store = {
    pattern: Pattern;
    process: StoreFunction;
}[];
type patternType = Exclude<ConstructorParameters<typeof Pattern>[0], (str: string) => string>;
/**
 * A processor is used to process source files in the `source` folder.
 */
declare class Processor {
    store: Store;
    constructor();
    list(): Store;
    register(fn: StoreFunction): void;
    register(pattern: patternType, fn: StoreFunction): void;
}
export = Processor;
