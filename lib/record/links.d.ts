import { Link } from '../link';
export interface LinksCache {
    [key: string]: RecordLink;
}
export interface LinkedRecord {
    _links: LinksCache;
    _changeToken: {};
    AttributesCopy: {
        new (source: object): LinksCache;
    };
    deepGet(path: string): any;
    deepSet(path: string, value: any, options: object): this;
    deepValidationError(path: string): any;
    getValidationError(path: string): any;
}
export declare const RecordLinksMixin: {
    linkAt(key: string): RecordLink;
    linkPath(path: string, options?: {}): RecordDeepLink;
    linkAll(): LinksCache;
};
export declare class RecordLink extends Link<any> {
    record: LinkedRecord;
    attr: any;
    constructor(record: LinkedRecord, attr: any, value: any);
    set(x: any): void;
    _error?: any;
    error: any;
}
export declare class RecordDeepLink extends Link<any> {
    record: LinkedRecord;
    path: string;
    options: object;
    constructor(record: LinkedRecord, path: string, options: object);
    _error?: any;
    error: any;
    readonly _changeToken: {};
    set(x: any): void;
}
