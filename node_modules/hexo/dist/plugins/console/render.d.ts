import type Hexo from '../../hexo';
import type Promise from 'bluebird';
interface RenderArgs {
    _: string[];
    o?: string;
    output?: string;
    pretty?: boolean;
    engine?: string;
    [key: string]: any;
}
declare function renderConsole(this: Hexo, args: RenderArgs): Promise<void>;
export = renderConsole;
