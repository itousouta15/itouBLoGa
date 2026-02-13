import Promise from 'bluebird';
import type Hexo from '../../hexo';
import type { BaseGeneratorReturn } from '../../types';
interface AssetGenerator extends BaseGeneratorReturn {
    data: {
        modified: boolean;
        data?: () => any;
    };
}
declare function assetGenerator(this: Hexo): Promise<AssetGenerator[]>;
export = assetGenerator;
