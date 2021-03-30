/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelResultCoreMappings from './SearchResponseModelResultCoreMappings';


/**
 * The SearchResponseModelMappings model module.
 * @module model/SearchResponseModelMappings
 * @version 0.1.13
 */
class SearchResponseModelMappings {
    /**
     * Constructs a new <code>SearchResponseModelMappings</code>.
     * @alias module:model/SearchResponseModelMappings
     */
    constructor() { 
        
        SearchResponseModelMappings.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelMappings</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelMappings} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelMappings} The populated <code>SearchResponseModelMappings</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelMappings();

            if (data.hasOwnProperty('core')) {
                obj['core'] = SearchResponseModelResultCoreMappings.constructFromObject(data['core']);
            }

        }
        return obj;
    }


}

/**
 * @member {module:model/SearchResponseModelResultCoreMappings} core
 */
SearchResponseModelMappings.prototype['core'] = undefined;





export default SearchResponseModelMappings;

