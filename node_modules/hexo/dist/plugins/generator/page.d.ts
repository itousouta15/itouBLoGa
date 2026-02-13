import type { BaseGeneratorReturn, PageSchema, SiteLocals } from '../../types';
type SimplePageGenerator = Omit<BaseGeneratorReturn, 'layout'> & {
    data: string;
};
interface NormalPageGenerator extends BaseGeneratorReturn {
    layout: string[];
    data: PageSchema;
}
type PageGenerator = SimplePageGenerator | NormalPageGenerator;
declare function pageGenerator(locals: SiteLocals): PageGenerator[];
export = pageGenerator;
