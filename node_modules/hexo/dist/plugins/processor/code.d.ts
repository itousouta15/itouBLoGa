import { Pattern } from 'hexo-util';
import type Hexo from '../../hexo';
import type { _File } from '../../box';
declare const _default: (ctx: Hexo) => {
    pattern: Pattern;
    process: (file: _File) => import("bluebird")<any>;
};
export = _default;
