/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
/* import for discriminator */
import SearchResponseModelFilterRange from './SearchResponseModelFilterRange';
import SearchResponseModelFilterValue from './SearchResponseModelFilterValue';


/**
 * The SearchResponseModelFilter model module.
 * @module model/SearchResponseModelFilter
 * @version 0.1.13
 */
class SearchResponseModelFilter {
    /**
     * Constructs a new <code>SearchResponseModelFilter</code>.
     * @alias module:model/SearchResponseModelFilter
     * @param type {module:model/SearchResponseModelFilter.TypeEnum} 
     */
    constructor(type) { 
        
        SearchResponseModelFilter.initialize(this, type);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, type) { 
        obj['type'] = type;
    }

    /**
     * Constructs a <code>SearchResponseModelFilter</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelFilter} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelFilter} The populated <code>SearchResponseModelFilter</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelFilter();

            if (data.hasOwnProperty('type')) {
                obj['type'] = ApiClient.convertToType(data['type'], 'String');
            }
            if (data.hasOwnProperty('field')) {
                obj['field'] = ApiClient.convertToType(data['field'], 'String');
            }
            if (data.hasOwnProperty('label')) {
                obj['label'] = ApiClient.convertToType(data['label'], 'String');
            }

            switch (obj['type']) {
                case 'range':
                    SearchResponseModelFilterRange.constructFromObject(data, obj);
                    break;
                case 'value':
                    SearchResponseModelFilterValue.constructFromObject(data, obj);
                    break;
                default:
                    break;
            }
        }
        return obj;
    }


}

/**
 * @member {module:model/SearchResponseModelFilter.TypeEnum} type
 */
SearchResponseModelFilter.prototype['type'] = undefined;

/**
 * @member {String} field
 */
SearchResponseModelFilter.prototype['field'] = undefined;

/**
 * @member {String} label
 */
SearchResponseModelFilter.prototype['label'] = undefined;




/**
 * Allowed values for the <code>type</code> property.
 * @enum {String}
 * @readonly
 */
SearchResponseModelFilter['TypeEnum'] = {

    /**
     * value: "value"
     * @const
     */
    "value": "value",

    /**
     * value: "range"
     * @const
     */
    "range": "range"
};



export default SearchResponseModelFilter;

