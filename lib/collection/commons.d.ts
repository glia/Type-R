import { Record } from '../record';
import { Owner, Transaction, Transactional, TransactionOptions } from '../transactions';
export interface CollectionCore extends Transactional, Owner {
    models: Record[];
    model: typeof Record;
    idAttribute: string;
    get(objOrId: string | Record | Object): Record;
}
export declare type Elements = (Object | Record)[];
export interface CollectionOptions extends TransactionOptions {
    sort?: boolean;
}
export declare type Comparator = (a: Record, b: Record) => number;
export declare function dispose(collection: CollectionCore): Record[];
export declare function convertAndAquire(collection: CollectionCore, attrs: {} | Record, options: CollectionOptions): Record;
export declare function free(owner: CollectionCore, child: Record, unset?: boolean): void;
export declare function freeAll(collection: CollectionCore, children: Record[]): Record[];
export declare function sortElements(collection: CollectionCore, options: CollectionOptions): boolean;
export interface IdIndex {
    [id: string]: Record;
}
export declare function addIndex(index: IdIndex, model: Record): void;
export declare function removeIndex(index: IdIndex, model: Record): void;
export declare function updateIndex(index: IdIndex, model: Record): void;
export declare class CollectionTransaction implements Transaction {
    object: CollectionCore;
    isRoot: boolean;
    added: Record[];
    removed: Record[];
    nested: Transaction[];
    sorted: boolean;
    constructor(object: CollectionCore, isRoot: boolean, added: Record[], removed: Record[], nested: Transaction[], sorted: boolean);
    commit(initiator?: Transactional): void;
}
export declare function logAggregationError(collection: CollectionCore, options: TransactionOptions): void;
