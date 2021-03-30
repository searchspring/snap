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
 * The SearchRequestModelFacets model module.
 * @module model/SearchRequestModelFacets
 * @version 0.1.13
 */
class SearchRequestModelFacets {
    /**
     * Constructs a new <code>SearchRequestModelFacets</code>.
     * @alias module:model/SearchRequestModelFacets
     */
    constructor() { 
        
        SearchRequestModelFacets.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchRequestModelFacets</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchRequestModelFacets} obj Optional instance to populate.
     * @return {module:model/SearchRequestModelFacets} The populated <code>SearchRequestModelFacets</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchRequestModelFacets();

            if (data.hasOwnProperty('limit')) {
                obj['limit'] = ApiClient.convertToType(data['limit'], 'Number');
            }
            if (data.hasOwnProperty('valueLimit')) {
                obj['valueLimit'] = ApiClient.convertToType(data['valueLimit'], 'Number');
            }
            if (data.hasOwnProperty('include')) {
                obj['include'] = ApiClient.convertToType(data['include'], ['String']);
            }
            if (data.hasOwnProperty('exclude')) {
                obj['exclude'] = ApiClient.convertToType(data['exclude'], ['String']);
            }

        }
        return obj;
    }


}

/**
 * @member {Number} limit
 */
SearchRequestModelFacets.prototype['limit'] = undefined;

/**
 * @member {Number} valueLimit
 */
SearchRequestModelFacets.prototype['valueLimit'] = undefined;

/**
 * @member {Array.<String>} include
 */
SearchRequestModelFacets.prototype['include'] = undefined;

/**
 * @member {Array.<String>} exclude
 */
SearchRequestModelFacets.prototype['exclude'] = undefined;





export default SearchRequestModelFacets;

