import { Record } from './transaction.ts' 
import { GenericAttribute } from './attribute.ts'
import { Owner, free, aquire, Transactional, TransactionOptions, TransactionalConstructor } from '../transactions.ts' 

export class TransactionalType extends GenericAttribute {
    type : TransactionalConstructor

    canBeUpdated( prev : Transactional, next : any ) : boolean {
        // If an object already exists, and new value is of incompatible type, let object handle the update.
        return prev && next && !( next instanceof this.type );
    }

    convert( value : any, options : TransactionOptions, record : Record ) : Transactional {
        // Invoke class factory to handle abstract classes
        return value == null || value instanceof this.type ? value : this.type.create( value, options, record );
    }

    create() : Transactional {
        return new (<any>this.type)(); // this the subclass of Transactional here.
    }

    handleChange( next : Transactional, prev : Transactional, record : Record ){
        prev && free( record, prev );
        next && aquire( record, next, this.name );

        if( next ){
            const { name } = this;
            if( next._owner ){
                record.listenTo( next, 'change', function( child ){
                    record._onChildrenChange( child, name );
                });
            }
            else{
                aquire( record, next, name );
            }
        }
    }
}

Record._attribute = TransactionalType;

/**
 * Two-phase commit is simple.
 * 
 * We always send two notifications.
 * First one marks parent as dirty, incrementing its counter.
 * It stops going upper, if parent is already dirty.
 * 
 * Second one performs an update, decrementing the counter.
 * It stops going further if parent is still dirty.
 * 
 * Need to generalize this behavior for deep updates.
 * 
 * 
 * !!!!!! Silent operates wrong. It must not prevent parent updates.
 * 
 * 
 * !!!! Deep update can only work on owned objects. Only trees.
 * Current algorithm is perfect for the owned trees. By all means.
 * 
 * 
 * 
 * We also have shared trees. (Can be handled with 'change' or 'commit' event)
 * 
 * And rombs. We cannot handle rombs.
 * 
 * In these cases, we need to bubble updates up. Can we use two phase for bubbling?
 * Say, 'begin' event opens transaction everywhere, 'commit' event closes transaction.
 * We really need to replace boolean flag with counter for that.
 * 
 * Looks like it will do the trick. But obviously, it will slow down the things a bit.
 */