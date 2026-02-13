import Promise from 'bluebird';
import type Hexo from '../../hexo';
import type { PostSchema } from '../../types';
declare function newPostPathFilter(this: Hexo, data?: Partial<PostSchema>, replace?: boolean): Promise<string>;
export = newPostPathFilter;
