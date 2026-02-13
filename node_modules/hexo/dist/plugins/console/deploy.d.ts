import type Hexo from '../../hexo';
import type Promise from 'bluebird';
interface DeployArgs {
    _?: string[];
    g?: boolean;
    generate?: boolean;
    [key: string]: any;
}
declare function deployConsole(this: Hexo, args: DeployArgs): Promise<any>;
export = deployConsole;
