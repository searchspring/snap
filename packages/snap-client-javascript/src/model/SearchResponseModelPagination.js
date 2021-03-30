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
 * The SearchResponseModelPagination model module.
 * @module model/SearchResponseModelPagination
 * @version 0.1.13
 */
class SearchResponseModelPagination {
    /**
     * Constructs a new <code>SearchResponseModelPagination</code>.
     * @alias module:model/SearchResponseModelPagination
     */
    constructor() { 
        
        SearchResponseModelPagination.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelPagination</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelPagination} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelPagination} The populated <code>SearchResponseModelPagination</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelPagination();

            if (data.hasOwnProperty('totalResults')) {
                obj['totalResults'] = ApiClient.convertToType(data['totalResults'], 'Number');
            }
            if (data.hasOwnProperty('page')) {
                obj['page'] = ApiClient.convertToType(data['page'], 'Number');
            }
            if (data.hasOwnProperty('defaultPageSize')) {
                obj['defaultPageSize'] = ApiClient.convertToType(data['defaultPageSize'], 'Number');
            }
            if (data.hasOwnProperty('pageSize')) {
                obj['pageSize'] = ApiClient.convertToType(data['pageSize'], 'Number');
            }

        }
        return obj;
    }


}

/**
 * @member {Number} totalResults
 */
SearchResponseModelPagination.prototype['totalResults'] = undefined;

/**
 * @member {Number} page
 */
SearchResponseModelPagination.prototype['page'] = undefined;

/**
 * @member {Number} defaultPageSize
 */
SearchResponseModelPagination.prototype['defaultPageSize'] = undefined;

/**
 * @member {Number} pageSize
 */
SearchResponseModelPagination.prototype['pageSize'] = undefined;





export default SearchResponseModelPagination;

