import type Hexo from '../hexo';
type BinaryRelationType<K extends PropertyKey, V extends PropertyKey> = {
    [key in K]: PropertyKey;
} & {
    [key in V]: PropertyKey;
};
declare class BinaryRelationIndex<K extends PropertyKey, V extends PropertyKey> {
    keyIndex: Map<PropertyKey, Set<PropertyKey>>;
    valueIndex: Map<PropertyKey, Set<PropertyKey>>;
    key: K;
    value: V;
    ctx: Hexo;
    schemaName: string;
    constructor(key: K, value: V, schemaName: string, ctx: Hexo);
    load(): void;
    saveHook(data: BinaryRelationType<K, V> & {
        _id: PropertyKey;
    }): void;
    removeHook(data: BinaryRelationType<K, V> & {
        _id: PropertyKey;
    }): void;
    findById(_id: PropertyKey): any;
    find(query: Partial<BinaryRelationType<K, V>>): any[];
    findOne(query: Partial<BinaryRelationType<K, V>>): any;
}
export default BinaryRelationIndex;
