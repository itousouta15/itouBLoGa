/// <reference types="node" />
import type Promise from 'bluebird';
import { type ReadFileOptions } from 'hexo-fs';
import type fs from 'fs';
declare class File {
    /**
     * Full path of the file
     */
    source: string;
    /**
     * Relative path to the box of the file
     */
    path: string;
    /**
     * The information from path matching.
     */
    params: any;
    /**
     * File type. The value can be create, update, skip, delete.
     */
    type: typeof File.TYPE_CREATE | typeof File.TYPE_UPDATE | typeof File.TYPE_SKIP | typeof File.TYPE_DELETE;
    static TYPE_CREATE: 'create';
    static TYPE_UPDATE: 'update';
    static TYPE_SKIP: 'skip';
    static TYPE_DELETE: 'delete';
    constructor({ source, path, params, type }: {
        source: string;
        path: string;
        params: any;
        type: typeof File.TYPE_CREATE | typeof File.TYPE_UPDATE | typeof File.TYPE_SKIP | typeof File.TYPE_DELETE;
    });
    read(options?: ReadFileOptions): Promise<string>;
    readSync(options?: ReadFileOptions): string;
    stat(): Promise<fs.Stats>;
    statSync(): fs.Stats;
}
export = File;
