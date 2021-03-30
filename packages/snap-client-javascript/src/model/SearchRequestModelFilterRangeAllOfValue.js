/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';


/**
 * The SearchRequestModelFilterRangeAllOfValue model module.
 * @module model/SearchRequestModelFilterRangeAllOfValue
 * @version 0.1.13
 */
class SearchRequestModelFilterRangeAllOfValue {
    /**
     * Constructs a new <code>SearchRequestModelFilterRangeAllOfValue</code>.
     * @alias module:model/SearchRequestModelFilterRangeAllOfValue
     */
    constructor() { 
        
        SearchRequestModelFilterRangeAllOfValue.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchRequestModelFilterRangeAllOfValue</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchRequestModelFilterRangeAllOfValue} obj Optional instance to populate.
     * @return {module:model/SearchRequestModelFilterRangeAllOfValue} The populated <code>SearchRequestModelFilterRangeAllOfValue</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchRequestModelFilterRangeAllOfValue();

            if (data.hasOwnProperty('low')) {
                obj['low'] = ApiClient.convertToType(data['low'], 'Number');
            }
            if (data.hasOwnProperty('high')) {
                obj['high'] = ApiClient.convertToType(data['high'], 'Number');
            }

        }
        return obj;
    }


}

/**
 * @member {Number} low
 */
SearchRequestModelFilterRangeAllOfValue.prototype['low'] = undefined;

/**
 * @member {Number} high
 */
SearchRequestModelFilterRangeAllOfValue.prototype['high'] = undefined;





export default SearchRequestModelFilterRangeAllOfValue;

