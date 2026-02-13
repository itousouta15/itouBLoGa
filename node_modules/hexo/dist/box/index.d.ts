/// <reference types="node" />
/// <reference types="node" />
import BlueBirdPromise from 'bluebird';
import File from './file';
import { Pattern } from 'hexo-util';
import { watch } from 'hexo-fs';
import { EventEmitter } from 'events';
import type Hexo from '../hexo';
import type { NodeJSLikeCallback } from '../types';
import type fs from 'fs';
interface Processor {
    pattern: Pattern;
    process: (file?: File) => any;
}
interface BoxOptions {
    persistent: boolean;
    awaitWriteFinish: {
        stabilityThreshold: number;
    };
    ignored: RegExp[];
    [key: string]: any;
}
declare class Box extends EventEmitter {
    options: BoxOptions;
    context: Hexo;
    base: string;
    processors: Processor[];
    _processingFiles: Record<string, boolean>;
    watcher: Awaited<ReturnType<typeof watch>> | null;
    Cache: any;
    File: any;
    ignore: string[];
    constructor(ctx: Hexo, base: string, options?: any);
    _createFileClass(): {
        new ({ source, path, params, type }: {
            source: string;
            path: string;
            params: any;
            type: "create" | "update" | "skip" | "delete";
        }): {
            box: Box;
            render(options?: any): BlueBirdPromise<any>;
            renderSync(options?: any): any;
            source: string;
            path: string;
            params: any;
            type: "create" | "update" | "skip" | "delete";
            read(options?: import("hexo-fs").ReadFileOptions): BlueBirdPromise<string>;
            readSync(options?: import("hexo-fs").ReadFileOptions): string;
            stat(): BlueBirdPromise<fs.Stats>;
            statSync(): fs.Stats;
        };
        TYPE_CREATE: "create";
        TYPE_UPDATE: "update";
        TYPE_SKIP: "skip";
        TYPE_DELETE: "delete";
    };
    addProcessor(pattern: (...args: any[]) => any): void;
    addProcessor(pattern: string | RegExp | Pattern | ((str: string) => any), fn: (...args: any[]) => any): void;
    _readDir(base: string, prefix?: string): BlueBirdPromise<string[]>;
    _checkFileStatus(path: string): {
        type: string;
        path: string;
    };
    process(callback?: NodeJSLikeCallback<any>): BlueBirdPromise<void | (string | void)[]>;
    _processFile(type: string, path: string): BlueBirdPromise<void | string>;
    watch(callback?: NodeJSLikeCallback<never>): BlueBirdPromise<void>;
    unwatch(): void;
    isWatching(): boolean;
}
export interface _File extends File {
    box: Box;
    render(options?: any): any;
    renderSync(options?: any): any;
}
export default Box;
