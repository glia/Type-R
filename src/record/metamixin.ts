import { tools, eventsApi, EventMap } from '../object-plus'
import { AnyType } from './attributes'
import { CompiledReference } from '../traversable'

export interface Attributes {
    [ key : string ] : AnyType
}

interface MetaMixin {
    [ key : string ] : ( _attributes : Attributes, _local : Attributes ) => any
}

export default function( _attributes, _local ) {
    const Mixin = tools.transform( {}, MetaMixin, stage => stage( _attributes, _local ) );
    Mixin._attributes = new Mixin.Attributes( _attributes );
    return Mixin;
}

const MetaMixin : MetaMixin = {
    _keys : _attributes => Object.keys( _attributes ),

    properties : ( _, _localAttributes ) => (
        tools.transform( <PropertyDescriptorMap>{}, _localAttributes, x => x.createPropertyDescriptor() )
    ),

    DefaultAttributes( _attributes ){
        const Constructor = new Function( '_attributes', 'source', 'clone', `
            if( clone ){
                ${ unroll( _attributes, key => `
                    this.${key} = _attributes.${key}.clone( source.${key} );
                ` )}
            }
            else{
                var x;

                ${ unroll( _attributes, ( key, _attr ) => `
                    this.${key} = ( x = source.${key} ) === void 0 ? ${defaultValue( key, _attr )} : x;
                `)}
            }
        `);

        Constructor.prototype = Object.prototype;
        return Constructor;
    },

    Attributes( _attributes ) {
        const Constructor = new Function( 'source',
            unroll( _attributes, key => `
                this.${key} = source.${key};
            ` )
        );
        
        Constructor.prototype = Object.prototype;
        return Constructor;
    },

    forEachAttr( _attributes ){
        if( !tools.log.level ){
            return new Function( 'a', 'f',`
                var v,
                    _a = this._attributes;

                ${ unroll( _attributes, name => `
                    ( v = a.${name} ) === void 0 || f( v, "${name}", _a.${name} );
                `)}
            `)
        }
    },

    _initialize : _attributes => 
        new Function( 'attributes', 'options',`
            var _a,
                _attributes = this._attributes;

            ${ unroll( _attributes, key => `
                _a = _attributes.${ key };
                _a.handleChange( attributes.${ key } = _a.transform( attributes.${ key }, options, void 0, record ), void 0, record );
            ` ) }

            this.attributes = this._previousAttributes = attributes;
        `),

    _toJSON : _attributes => (
        new Function( `
            var json = {},
                v = this.attributes,
                a = this._attributes;

            ${ unroll( _attributes, ( key, attr ) => attr.toJSON && `
                json.${key} = a.${key}.toJSON.call( this, v.${key}, '${key}' );
            `)}

            return json;
        ` )
    ),

    _parse( _attributes, _localAttributes ) {
        if( hasParse( _localAttributes ) ){
            return new Function( 'json', `
                var _attributes = this._attributes;

                ${ unroll( _attributes, ( key, attr ) => attr.parse && `
                    if( json.${key} !== void 0 ){
                        json.${key} = _attributes.${key}.parse.call( this, json.${key}, "${key}");
                    }
                ` ) }

                return json;
            `);
        }
    },

    _localEvents( attrSpecs ) : eventsApi.EventMap {
        let events : eventsApi.EventMap;

        for( var key in attrSpecs ){
            const attribute = attrSpecs[ key ],
                { _onChange } = attribute.options; 

            if( _onChange ){
                events || ( events = new EventMap() );

                events.addEvent( 'change:' + key,
                    typeof _onChange === 'string' ?
                        createWatcherFromRef( _onChange, key ) : 
                        wrapWatcher( _onChange, key ) );
            }
        }

        return events;
    }
};

/** @private */
function wrapWatcher( watcher, key ){
    return function( record, value ){
        watcher.call( record, value, key );
    } 
}

/** @private */
function createWatcherFromRef( ref : string, key : string ){
    const { local, resolve, tail } = new CompiledReference( ref, true );
    return local ?
        ( record, value ) => record[ tail ]( value, key ) :
        ( record, value ) => resolve( record )[ tail ]( value, key );
}

const defaultValue = ( key : string, _attr : AnyType ) : string => (
    _attr.value === void 0 ?
        ( _attr.type ? `_attributes.${key}.create()` : 'void 0 ' ) :
        ( tools.isValidJSON( _attr.value ) ? JSON.stringify( _attr.value ) : `_attributes.${key}.value` )
);

function hasParse( _attributes : Attributes ){
    for( let key in _attributes ){
        const local = _attributes[ key ];
        if( local && local.parse ){
            return true;
        }
    }

    return false;
}

function unroll< T >( _attributes : { [ key : string ] : T }, fun : ( key : string, attr : T ) => string, separator = '' ) : string {
    const body = [];
    
    for( let key in _attributes ){
        const line = fun( key, _attributes[ key ] );
        line && body.push( line );
    }

    return body.join( separator );
}