/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelSearchQuery from './SearchRequestModelSearchQuery';


/**
 * The SearchRequestModelSearch model module.
 * @module model/SearchRequestModelSearch
 * @version 0.1.13
 */
class SearchRequestModelSearch {
    /**
     * Constructs a new <code>SearchRequestModelSearch</code>.
     * @alias module:model/SearchRequestModelSearch
     */
    constructor() { 
        
        SearchRequestModelSearch.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchRequestModelSearch</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchRequestModelSearch} obj Optional instance to populate.
     * @return {module:model/SearchRequestModelSearch} The populated <code>SearchRequestModelSearch</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchRequestModelSearch();

            if (data.hasOwnProperty('query')) {
                obj['query'] = SearchRequestModelSearchQuery.constructFromObject(data['query']);
            }
            if (data.hasOwnProperty('subQuery')) {
                obj['subQuery'] = ApiClient.convertToType(data['subQuery'], 'String');
            }
            if (data.hasOwnProperty('originalQuery')) {
                obj['originalQuery'] = ApiClient.convertToType(data['originalQuery'], 'String');
            }
            if (data.hasOwnProperty('redirectResponse')) {
                obj['redirectResponse'] = ApiClient.convertToType(data['redirectResponse'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {module:model/SearchRequestModelSearchQuery} query
 */
SearchRequestModelSearch.prototype['query'] = undefined;

/**
 * @member {String} subQuery
 */
SearchRequestModelSearch.prototype['subQuery'] = undefined;

/**
 * Original query if spell correction occured.
 * @member {String} originalQuery
 */
SearchRequestModelSearch.prototype['originalQuery'] = undefined;

/**
 * Changes how Redirects behave in the response.
 * @member {module:model/SearchRequestModelSearch.RedirectResponseEnum} redirectResponse
 */
SearchRequestModelSearch.prototype['redirectResponse'] = undefined;




/**
 * Allowed values for the <code>redirectResponse</code> property.
 * @enum {String}
 * @readonly
 */
SearchRequestModelSearch['RedirectResponseEnum'] = {

    /**
     * value: "full"
     * @const
     */
    "full": "full",

    /**
     * value: "minimal"
     * @const
     */
    "minimal": "minimal",

    /**
     * value: "direct"
     * @const
     */
    "direct": "direct"
};



export default SearchRequestModelSearch;

