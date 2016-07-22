import { Record, RecordDefinition, AttributeDescriptorMap } from './transaction.ts'
import { assign, defaults, omit, Mixable, ClassDefinition, getBaseClass } from '../objectplus/index.ts'
import { compile, AttributesSpec } from './define.ts'
import { ChainableAttributeSpec } from './typespec.ts'

import { TransactionalType } from './nestedTypes.ts'
import './basicTypes.ts'

Record.define = function( protoProps : RecordDefinition, staticProps ){
    const BaseConstructor : typeof Record = getBaseClass( this ),
          baseProto : Record = BaseConstructor.prototype;

    if( protoProps ) {
        // Compile attributes spec, creating definition mixin.
        const definition = compile( getAttributes( protoProps ), <AttributesSpec> baseProto._attributes );

        // Explicit 'properties' declaration overrides auto-generated attribute properties.
        if( protoProps.properties === false ){
            definition.properties = {};
        }

        assign( definition.properties, protoProps.properties || {} );

        // Merge in definition.
        defaults( definition, omit( protoProps, 'attributes', 'collection' ) );            
        Mixable.define.call( this, definition, staticProps );
        defineCollection.call( this, protoProps && protoProps.collection );
    }

    return this;
}

Record.predefine = function(){
    Mixable.predefine.call( this );

    this.Collection = getBaseClass( this ).Collection.extend();
    this.Collection.prototype.model = this;

    return this;
}

Record._attribute = TransactionalType;

function getAttributes({ defaults, attributes, idAttribute } : RecordDefinition ) : AttributeDescriptorMap {
    const definition = typeof defaults === 'function' ? (<any>defaults)() : attributes || defaults || {};
    
    // If there is an undeclared idAttribute, add its definition as untyped generic attribute.
    if( idAttribute && !( idAttribute in definition ) ){
        definition[ idAttribute ] = void 0;
    }

    return definition;
}

export { Record, ChainableAttributeSpec, TransactionalType }

function defineCollection( collection : {} ){
    const BaseCollection = getBaseClass( this ).Collection;

    let CollectionConstructor;

    // If collection constructor is specified, just take it. 
    if( typeof collection === 'function' ) {
        CollectionConstructor = collection;
    } 
    // Same when Collection is specified as static class member.  
    else if( this.Collection !== BaseCollection ){
        CollectionConstructor = this.Collection;
        if( collection ) (<any>CollectionConstructor).mixins( collection );
    } 
    // Otherwise we need to create new Collection type...
    else{
        // ...which must extend Collection of our base Record.
        CollectionConstructor = <any> BaseCollection.extend( collection );
    }

    // Link collection with the record
    CollectionConstructor.prototype.model = this;
    this.Collection = CollectionConstructor;
}