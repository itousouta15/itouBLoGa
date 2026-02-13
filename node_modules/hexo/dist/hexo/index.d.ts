/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import Promise from 'bluebird';
import Database from 'warehouse';
import { EventEmitter } from 'events';
import Module from 'module';
import logger from 'hexo-log';
import { Console, Deployer, Filter, Generator, Helper, Highlight, Injector, Migrator, Processor, Renderer, Tag } from '../extend';
import Render from './render';
import Post from './post';
import Scaffold from './scaffold';
import Source from './source';
import Router from './router';
import Theme from '../theme';
import Locals from './locals';
import defaultConfig from './default_config';
import type { BaseGeneratorReturn, FilterOptions, NodeJSLikeCallback, SiteLocals } from '../types';
import type { AddSchemaTypeOptions } from 'warehouse/dist/types';
import type Schema from 'warehouse/dist/schema';
import BinaryRelationIndex from '../models/binary_relation_index';
interface Args {
    /**
     * Enable debug mode. Display debug messages in the terminal and save debug.log in the root directory.
     */
    debug?: boolean;
    /**
     * Enable safe mode. Don’t load any plugins.
     */
    safe?: boolean;
    /**
     * Enable silent mode. Don’t display any messages in the terminal.
     */
    silent?: boolean;
    /**
     * Enable to add drafts to the posts list.
     */
    draft?: boolean;
    /**
   * Enable to add drafts to the posts list.
   */
    drafts?: boolean;
    _?: string[];
    output?: string;
    /**
     * Specify the path of the configuration file.
     */
    config?: string;
    [key: string]: any;
}
interface Extend {
    console: Console;
    deployer: Deployer;
    filter: Filter;
    generator: Generator;
    helper: Helper;
    highlight: Highlight;
    injector: Injector;
    migrator: Migrator;
    processor: Processor;
    renderer: Renderer;
    tag: Tag;
}
interface Env {
    args: Args;
    debug: boolean;
    safe: boolean;
    silent: boolean;
    env: string;
    version: string;
    cmd: string;
    init: boolean;
}
type DefaultConfigType = typeof defaultConfig;
interface Config extends DefaultConfigType {
    [key: string]: any;
}
declare module 'module' {
    function _nodeModulePaths(path: string): string[];
    function _resolveFilename(request: string, parent: Module, isMain?: any, options?: any): string;
    const _extensions: NodeJS.RequireExtensions, _cache: any;
}
interface Hexo {
    /**
     * Emitted before deployment begins.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#deployBefore
     */
    on(event: 'deployBefore', listener: (...args: any[]) => any): this;
    /**
     * Emitted after deployment begins.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#deployAfter
     */
    on(event: 'deployAfter', listener: (...args: any[]) => any): this;
    /**
     * Emitted before Hexo exits.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#exit
     */
    on(event: 'exit', listener: (...args: any[]) => any): this;
    /**
     * Emitted before generation begins.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#generateBefore
     */
    on(event: 'generateBefore', listener: (...args: any[]) => any): this;
    /**
     * Emitted after generation finishes.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#generateAfter
     */
    on(event: 'generateAfter', listener: (...args: any[]) => any): this;
    /**
     * Emitted after a new post has been created. This event returns the post data:
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#new
     */
    on(event: 'new', listener: (post: {
        path: string;
        content: string;
    }) => any): this;
    /**
     * Emitted before processing begins. This event returns a path representing the root directory of the box.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#processBefore
     */
    on(event: 'processBefore', listener: (...args: any[]) => any): this;
    /**
     * Emitted after processing finishes. This event returns a path representing the root directory of the box.
     * @param event
     * @param listener
     * @link https://hexo.io/api/events.html#processAfter
     */
    on(event: 'processAfter', listener: (...args: any[]) => any): this;
    /**
     * Emitted after initialization finishes.
     * @param event
     * @param listener
     */
    on(event: 'ready', listener: (...args: any[]) => any): this;
    /**
     * undescripted on emit
     * @param event
     * @param listener
     */
    on(event: string, listener: (...args: any[]) => any): any;
    emit(event: string, ...args: any[]): any;
}
declare class Hexo extends EventEmitter {
    base_dir: string;
    public_dir: string;
    source_dir: string;
    plugin_dir: string;
    script_dir: string;
    scaffold_dir: string;
    theme_dir: string;
    theme_script_dir: string;
    env: Env;
    extend: Extend;
    config: Config;
    log: ReturnType<typeof logger>;
    render: Render;
    route: Router;
    post: Post;
    scaffold: Scaffold;
    _dbLoaded: boolean;
    _isGenerating: boolean;
    database: Database;
    config_path: string;
    source: Source;
    theme: Theme;
    locals: Locals;
    version: string;
    _watchBox: () => void;
    lib_dir: string;
    core_dir: string;
    static lib_dir: string;
    static core_dir: string;
    static version: string;
    _binaryRelationIndex: {
        post_tag: BinaryRelationIndex<'post_id', 'tag_id'>;
        post_category: BinaryRelationIndex<'post_id', 'category_id'>;
    };
    constructor(base?: string, args?: Args);
    _bindLocals(): void;
    /**
     * Load configuration and plugins.
     * @returns {Promise}
     * @link https://hexo.io/api#Initialize
     */
    init(): Promise<void>;
    /**
     * Call any console command explicitly.
     * @param name
     * @param args
     * @param callback
     * @returns {Promise}
     * @link https://hexo.io/api#Execute-Commands
     */
    call(name: string, callback?: NodeJSLikeCallback<any>): Promise<any>;
    call(name: string, args: object, callback?: NodeJSLikeCallback<any>): Promise<any>;
    model(name: string, schema?: Schema | Record<string, AddSchemaTypeOptions>): import("warehouse/dist/model").default<any>;
    resolvePlugin(name: string, basedir: string): string;
    loadPlugin(path: string, callback?: NodeJSLikeCallback<any>): Promise<any>;
    _showDrafts(): boolean;
    /**
     * Load all files in the source folder as well as the theme data.
     * @param callback
     * @returns {Promise}
     * @link https://hexo.io/api#Load-Files
     */
    load(callback?: NodeJSLikeCallback<any>): Promise<any>;
    /**
     * Load all files in the source folder as well as the theme data.
     * Start watching for file changes continuously.
     * @param callback
     * @returns {Promise}
     * @link https://hexo.io/api#Load-Files
     */
    watch(callback?: NodeJSLikeCallback<any>): Promise<any>;
    unwatch(): void;
    _generateLocals(): {
        new (path: string, locals: any): {
            page: any;
            path: string;
            url: string;
            config: Config;
            theme: any;
            layout: string;
            env: Env;
            view_dir: string;
            site: SiteLocals;
            cache?: boolean;
        };
    };
    _runGenerators(): Promise<BaseGeneratorReturn[]>;
    _routerRefresh(runningGenerators: Promise<BaseGeneratorReturn[]>, useCache: boolean): Promise<void>;
    _generate(options?: {
        cache?: boolean;
    }): Promise<any>;
    /**
     * Exit gracefully and finish up important things such as saving the database.
     * @param err
     * @returns {Promise}
     * @link https://hexo.io/api/#Exit
     */
    exit(err?: any): Promise<void>;
    execFilter(type: string, data: any, options?: FilterOptions): Promise<any>;
    execFilterSync(type: string, data: any, options?: FilterOptions): any;
}
declare global {
    const hexo: Hexo;
}
export = Hexo;
