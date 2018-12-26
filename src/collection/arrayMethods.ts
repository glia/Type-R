export type Predicate<R> = ( ( val : R, key? : number ) => boolean ) | Partial<R>;

export abstract class ArrayMixin<R> {
    models : R[]
    abstract get( modelOrId : string | Partial<R> ) : R;

    map<T>( a_fun : ( val : R, key? : number ) => T, context? : any ) : T[]{
        const { models } = this,
            res = Array( models.length ),
            iteratee = context ? a_fun.bind( context ) : a_fun;

        for( var i = 0, j = 0; i < models.length; i++ ){
            const val = iteratee( models[ i ], i );
            val === void 0 || ( res[ j++ ] = val );
        }

        if( i !== j ){
            res.length = j;
        }

        return res;
    }

    reduce<T>( iteratee : (previousValue: R, currentValue: R, currentIndex?: number ) => R ) : R
    reduce<T>( iteratee : (previousValue: T, currentValue: R, currentIndex?: number ) => T, init? : any ) : T
    reduce<T>( iteratee : (previousValue: any, currentValue: any, currentIndex?: number ) => any, init? : any ) : T | R {
        return init === void 0 ? this.models.reduce( iteratee ) : this.models.reduce( iteratee, init );
    }

    // Slice out a sub-array of models from the collection.
    slice( begin? : number, end? : number ) : R[] {
        return this.models.slice( begin, end );
    }
  
    indexOf( modelOrId : string | Partial<R> ) : number {
        return this.models.indexOf( this.get( modelOrId ) );
    }

    filter( iteratee : Predicate<R>, context? : any ) : R[] {
        return this.models.filter( toPredicateFunction( iteratee ), context );
    }

    find( iteratee : Predicate<R>, context? : any ) : R {
        return this.models.find( toPredicateFunction( iteratee ), context );
    }

    some( iteratee : Predicate<R>, context? : any ) : boolean {
        return this.models.some( toPredicateFunction( iteratee ), context );
    }

    each( a_fun : ( val : R, key? : number ) => void, context? : any ) : void {
        const { models } = this,
            iteratee = context ? a_fun.bind( context ) : a_fun;

        for( let i = 0; i < models.length; i++ ){
            const res = iteratee( models[ i ], i );
            if( res !== void 0 ) return res;
        }
    }

    forEach( iteratee : ( val : R, key? : number ) => void, context? : any ) : void {
        this.each( iteratee, context );
    }

    values() : IterableIterator<R> {
        return this.models.values();
    }

    entries() : IterableIterator<[ number, R ]>{
        return this.models.entries();
    }

    every( iteratee : Predicate<R>, context? : any ) : boolean {
        return this.models.every( toPredicateFunction( iteratee ), context );
    }

    pluck<K extends keyof R>( key : K ) : R[K][] {
        return this.map( model => model[ key ] );
    }
}

const noOp = x => x;

function toPredicateFunction<R>( iteratee : Predicate<R>, context? : any ){
    if( iteratee == null ) return noOp;

    switch( typeof iteratee ){
        case 'function' : return iteratee;
        case 'object' :
            const keys = Object.keys( iteratee );
            
            return x => {
                for( let key of keys ){
                    if( iteratee[ key ] !== x[ key ] )
                        return false;
                }

                return true;
            }
        default : throw new Error( 'Invalid iteratee' );
    }
}