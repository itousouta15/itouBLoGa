import type Hexo from '../../hexo';
import type Promise from 'bluebird';
interface PublishArgs {
    _: string[];
    r?: boolean;
    replace?: boolean;
    [key: string]: any;
}
declare function publishConsole(this: Hexo, args: PublishArgs): Promise<void>;
export = publishConsole;
