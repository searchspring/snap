/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelMerchandisingContent from './SearchResponseModelMerchandisingContent';


/**
 * The SearchResponseModelMerchandising model module.
 * @module model/SearchResponseModelMerchandising
 * @version 0.1.13
 */
class SearchResponseModelMerchandising {
    /**
     * Constructs a new <code>SearchResponseModelMerchandising</code>.
     * @alias module:model/SearchResponseModelMerchandising
     */
    constructor() { 
        
        SearchResponseModelMerchandising.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelMerchandising</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelMerchandising} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelMerchandising} The populated <code>SearchResponseModelMerchandising</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelMerchandising();

            if (data.hasOwnProperty('redirect')) {
                obj['redirect'] = ApiClient.convertToType(data['redirect'], 'String');
            }
            if (data.hasOwnProperty('content')) {
                obj['content'] = SearchResponseModelMerchandisingContent.constructFromObject(data['content']);
            }

        }
        return obj;
    }


}

/**
 * @member {String} redirect
 */
SearchResponseModelMerchandising.prototype['redirect'] = undefined;

/**
 * @member {module:model/SearchResponseModelMerchandisingContent} content
 */
SearchResponseModelMerchandising.prototype['content'] = undefined;





export default SearchResponseModelMerchandising;

