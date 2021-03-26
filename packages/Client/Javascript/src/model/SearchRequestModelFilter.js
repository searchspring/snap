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
import SearchRequestModelFilterRange from './SearchRequestModelFilterRange';
import SearchRequestModelFilterValue from './SearchRequestModelFilterValue';


/**
 * The SearchRequestModelFilter model module.
 * @module model/SearchRequestModelFilter
 * @version 0.1.13
 */
class SearchRequestModelFilter {
    /**
     * Constructs a new <code>SearchRequestModelFilter</code>.
     * @alias module:model/SearchRequestModelFilter
     * @param type {module:model/SearchRequestModelFilter.TypeEnum} 
     */
    constructor(type) { 
        
        SearchRequestModelFilter.initialize(this, type);
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
     * Constructs a <code>SearchRequestModelFilter</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchRequestModelFilter} obj Optional instance to populate.
     * @return {module:model/SearchRequestModelFilter} The populated <code>SearchRequestModelFilter</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchRequestModelFilter();

            if (data.hasOwnProperty('type')) {
                obj['type'] = ApiClient.convertToType(data['type'], 'String');
            }
            if (data.hasOwnProperty('field')) {
                obj['field'] = ApiClient.convertToType(data['field'], 'String');
            }
            if (data.hasOwnProperty('background')) {
                obj['background'] = ApiClient.convertToType(data['background'], 'Boolean');
            }

            switch (obj['type']) {
                case 'range':
                    SearchRequestModelFilterRange.constructFromObject(data, obj);
                    break;
                case 'value':
                    SearchRequestModelFilterValue.constructFromObject(data, obj);
                    break;
                default:
                    break;
            }
        }
        return obj;
    }


}

/**
 * @member {module:model/SearchRequestModelFilter.TypeEnum} type
 */
SearchRequestModelFilter.prototype['type'] = undefined;

/**
 * @member {String} field
 */
SearchRequestModelFilter.prototype['field'] = undefined;

/**
 * @member {Boolean} background
 */
SearchRequestModelFilter.prototype['background'] = undefined;




/**
 * Allowed values for the <code>type</code> property.
 * @enum {String}
 * @readonly
 */
SearchRequestModelFilter['TypeEnum'] = {

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



export default SearchRequestModelFilter;

