import type Hexo from '../../hexo';
import Promise from 'bluebird';
declare function codeGenerator(this: Hexo): Promise<any[]>;
export = codeGenerator;
