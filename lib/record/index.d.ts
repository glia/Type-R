import { MixableConstructor } from '../object-plus';
import { Infer } from './attrDef';
import { Record } from './record';
import { CollectionConstructor } from '../collection';
export * from './attrDef';
export * from './metatypes';
export { Record };
export declare type InferAttrs<A extends object> = {
    [K in keyof A]: Infer<A[K]>;
};
export interface RecordConstructor<A> extends MixableConstructor {
    new (attrs?: Partial<A>, options?: object): Record & A;
    prototype: Record;
    Collection: CollectionConstructor<Record & A>;
}
export declare function attributes<D extends object>(attrDefs: D): RecordConstructor<InferAttrs<D>>;
export declare function auto(value: any): PropertyDecorator;
export declare function auto(proto: object, attrName: string): void;
