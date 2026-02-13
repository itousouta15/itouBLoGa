import moment from 'moment';
import Promise from 'bluebird';
import type Hexo from './index';
import type { NodeJSLikeCallback, RenderData } from '../types';
interface Result {
    path: string;
    content: string;
}
interface PostData {
    title?: string | number;
    layout?: string;
    slug?: string | number;
    path?: string;
    date?: moment.Moment;
    [prop: string]: any;
}
declare class Post {
    context: Hexo;
    constructor(context: Hexo);
    create(data: PostData, callback?: NodeJSLikeCallback<any>): Promise<Result>;
    create(data: PostData, replace: boolean, callback?: NodeJSLikeCallback<any>): Promise<Result>;
    _getScaffold(layout: string): Promise<string>;
    _renderScaffold(data: PostData): Promise<string>;
    publish(data: PostData, replace?: boolean): Promise<Result>;
    publish(data: PostData, callback?: NodeJSLikeCallback<Result>): Promise<Result>;
    publish(data: PostData, replace: boolean, callback?: NodeJSLikeCallback<Result>): Promise<Result>;
    render(source: string, data?: RenderData, callback?: NodeJSLikeCallback<never>): any;
}
export = Post;
