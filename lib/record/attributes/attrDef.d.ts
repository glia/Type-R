import { AttributeOptions, Parse } from './any';
import { EventsDefinition } from '../../object-plus';
import { IOEndpoint } from '../../io-tools';
export interface AttributeCheck {
    (value: any, key: string): boolean;
    error?: any;
}
export interface AttributeDescriptor {
    options: AttributeOptions;
    check(check: AttributeCheck, error: any): AttributeDescriptor;
    isRequired: AttributeDescriptor;
    endpoint(endpoint: IOEndpoint): AttributeDescriptor;
    watcher(ref: string | ((value: any, key: string) => void)): AttributeDescriptor;
    parse(fun: Parse): AttributeDescriptor;
    toJSON(fun: any): AttributeDescriptor;
    get(fun: any): AttributeDescriptor;
    set(fun: any): AttributeDescriptor;
    changeEvents(events: boolean): AttributeDescriptor;
    events(map: EventsDefinition): AttributeDescriptor;
    value(x: any): AttributeDescriptor;
    metadata(options: object): AttributeDescriptor;
}
export declare class ChainableAttributeSpec implements AttributeDescriptor {
    options: AttributeOptions;
    constructor(options: AttributeOptions);
    check(check: AttributeCheck, error: any): ChainableAttributeSpec;
    readonly asProp: (proto: object, name: string) => void;
    readonly isRequired: ChainableAttributeSpec;
    endpoint(endpoint: IOEndpoint): ChainableAttributeSpec;
    watcher(ref: string | ((value: any, key: string) => void)): ChainableAttributeSpec;
    parse(fun: Parse): ChainableAttributeSpec;
    toJSON(fun: any): ChainableAttributeSpec;
    get(fun: any): ChainableAttributeSpec;
    set(fun: any): ChainableAttributeSpec;
    changeEvents(events: boolean): ChainableAttributeSpec;
    events(map: EventsDefinition): ChainableAttributeSpec;
    readonly has: ChainableAttributeSpec;
    metadata(options: AttributeOptions): ChainableAttributeSpec;
    value(x: any): ChainableAttributeSpec;
}
declare global  {
    interface Function {
        value: (x: any) => ChainableAttributeSpec;
        isRequired: ChainableAttributeSpec;
        asProp: PropertyDecorator;
        has: ChainableAttributeSpec;
    }
}
export declare function toAttributeOptions(spec: any): AttributeOptions;
export interface UniversalTypeSpec extends PropertyDecorator, AttributeDescriptor {
}
export declare function type(Ctor: Function): UniversalTypeSpec;
