import type Hexo from '../../../hexo';
import type Promise from 'bluebird';
interface ListArgs {
    _: string[];
}
declare function listConsole(this: Hexo, args: ListArgs): Promise<void>;
export = listConsole;
