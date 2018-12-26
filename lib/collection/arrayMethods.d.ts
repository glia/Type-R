export declare type Predicate<R> = ((val: R, key?: number) => boolean) | Partial<R>;
export declare abstract class ArrayMixin<R> {
    models: R[];
    abstract get(modelOrId: string | Partial<R>): R;
    map<T>(a_fun: (val: R, key?: number) => T, context?: any): T[];
    reduce<T>(iteratee: (previousValue: R, currentValue: R, currentIndex?: number) => R): R;
    reduce<T>(iteratee: (previousValue: T, currentValue: R, currentIndex?: number) => T, init?: any): T;
    slice(begin?: number, end?: number): R[];
    indexOf(modelOrId: string | Partial<R>): number;
    filter(iteratee: Predicate<R>, context?: any): R[];
    find(iteratee: Predicate<R>, context?: any): R;
    some(iteratee: Predicate<R>, context?: any): boolean;
    each(a_fun: (val: R, key?: number) => void, context?: any): void;
    forEach(iteratee: (val: R, key?: number) => void, context?: any): void;
    values(): IterableIterator<R>;
    entries(): IterableIterator<[number, R]>;
    every(iteratee: Predicate<R>, context?: any): boolean;
    pluck<K extends keyof R>(key: K): R[K][];
}
