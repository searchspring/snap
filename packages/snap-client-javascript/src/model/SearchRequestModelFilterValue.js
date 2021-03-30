/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelFilter from './SearchRequestModelFilter';
import SearchRequestModelFilterValueAllOf from './SearchRequestModelFilterValueAllOf';


/**
 * The SearchRequestModelFilterValue model module.
 * @module model/SearchRequestModelFilterValue
 * @version 0.1.13
 */
class SearchRequestModelFilterValue {
    /**
     * Constructs a new <code>SearchRequestModelFilterValue</code>.
     * @alias module:model/SearchRequestModelFilterValue
     * @extends module:model/SearchRequestModelFilter
     * @implements module:model/SearchRequestModelFilter
     * @implements module:model/SearchRequestModelFilterValueAllOf
     * @param type {module:model/SearchRequestModelFilterValue.TypeEnum} 
     */
    constructor(type) { 
        SearchRequestModelFilter.initialize(this, type);SearchRequestModelFilterValueAllOf.initialize(this);
        SearchRequestModelFilterValue.initialize(this, type);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, type) { 
    }

    /**
     * Constructs a <code>SearchRequestModelFilterValue</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchRequestModelFilterValue} obj Optional instance to populate.
     * @return {module:model/SearchRequestModelFilterValue} The populated <code>SearchRequestModelFilterValue</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchRequestModelFilterValue();

            if (data.hasOwnProperty('value')) {
                obj['value'] = ApiClient.convertToType(data['value'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {String} value
 */
SearchRequestModelFilterValue.prototype['value'] = undefined;





export default SearchRequestModelFilterValue;

