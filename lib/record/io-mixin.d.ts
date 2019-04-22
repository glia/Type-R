import { IOEndpoint, IONode, IOOptions, IOPromise } from '../io-tools';
import { TransactionOptions } from '../transactions';
export interface IORecord extends IONode {
    getEndpoint(): IOEndpoint;
    save(options?: TransactionOptions): IOPromise<this>;
    fetch(options?: TransactionOptions): IOPromise<this>;
    destroy(options?: TransactionOptions): IOPromise<this>;
    toJSON(options?: TransactionOptions): any;
    parse(data: any, options?: TransactionOptions): any;
    isNew(): boolean;
    id: string | number;
    set(json: object, options: TransactionOptions): this;
}
export declare const IORecordMixin: {
    save(this: IORecord, options?: IOOptions): IOPromise<any>;
    fetch(options?: IOOptions): IOPromise<any>;
    destroy(options?: IOOptions): IOPromise<any>;
};
