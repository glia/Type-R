import { Link } from '../link'

export interface LinksCache {
    [ key : string ] : RecordLink
}

export interface LinkedRecord {
    _links : LinksCache
    _changeToken : {}

    AttributesCopy : { new ( source : object ) : LinksCache }

    deepGet( path : string ) : any
    deepSet( path : string, value : any, options : object ) : this
    deepValidationError( path : string ) : any
    getValidationError( path : string ) : any
}

export const RecordLinksMixin = {
    // Link to the record's attribute by its key.
    linkAt( key : string ) : RecordLink {
        return cacheLink( getLinksCache( this ), this, key );
    },

    // Link to the attribute of the record's tree by symbolic path.
    linkPath( path : string, options? : {} ) : RecordDeepLink {
        return new RecordDeepLink( this, path, options )
    },

    // Link all (or listed) attributes and return links cache.
    linkAll() : LinksCache {
        const links = getLinksCache( this );

        if( arguments.length ){
            for( let i = 0; i < arguments.length; i++ ){
                cacheLink( links, this, arguments[ i ] );
            }
        }
        else{
            const { attributes } = this;

            for( let key in attributes ){
                attributes[ key ] === void 0 || cacheLink( links, this, key );
            }
        }

        return links;
    }
};

function getLinksCache( record : LinkedRecord ) : LinksCache {
    return record._links || ( record._links = new record.AttributesCopy( {} ) );
}

function cacheLink( links : LinksCache, record : LinkedRecord, key : string ) : RecordLink {
    var cached = links[ key ],
        value = record[ key ];

    return cached && cached.value === value ? cached
                : links[ key ] = new RecordLink( record, key, value );
}


/**
 * Link to Type-R's record attribute.
 * Strict evaluation of value, lazy evaluation of validation error.
 * Links are cached in the records
 */
export class RecordLink extends Link< any > {
    constructor( public record : LinkedRecord, public attr, value ){
        super( value );
    }

    set( x ){
        this.record[ this.attr ] = x;
    }

    _error? : any

    get error(){
        return this._error === void 0 ?
                    this.record.getValidationError( this.attr ) :
                    this._error;
    }

    set error( x ){
        this._error = x;
    }
}

export class RecordDeepLink extends Link< any > {
    constructor( public record : LinkedRecord, public path : string, public options : object ){
        super( record.deepGet( path ) );
    }

    _error? : any

    get error(){
        if( this._error === void 0 ){
            this._error = this.record.deepValidationError( this.path ) || null;
        }

        return this._error;
    }

    set error( x ){
        this._error = x;
    }

    get _changeToken(){
        return this.record._changeToken;
    }

    set( x ){
        this.record.deepSet( this.path, x, this.options );
    }
}