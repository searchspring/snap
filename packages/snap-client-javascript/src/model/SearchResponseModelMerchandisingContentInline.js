/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelMerchandisingContentConfig from './SearchResponseModelMerchandisingContentConfig';


/**
 * The SearchResponseModelMerchandisingContentInline model module.
 * @module model/SearchResponseModelMerchandisingContentInline
 * @version 0.1.13
 */
class SearchResponseModelMerchandisingContentInline {
    /**
     * Constructs a new <code>SearchResponseModelMerchandisingContentInline</code>.
     * @alias module:model/SearchResponseModelMerchandisingContentInline
     */
    constructor() { 
        
        SearchResponseModelMerchandisingContentInline.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelMerchandisingContentInline</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelMerchandisingContentInline} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelMerchandisingContentInline} The populated <code>SearchResponseModelMerchandisingContentInline</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelMerchandisingContentInline();

            if (data.hasOwnProperty('config')) {
                obj['config'] = SearchResponseModelMerchandisingContentConfig.constructFromObject(data['config']);
            }
            if (data.hasOwnProperty('value')) {
                obj['value'] = ApiClient.convertToType(data['value'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {module:model/SearchResponseModelMerchandisingContentConfig} config
 */
SearchResponseModelMerchandisingContentInline.prototype['config'] = undefined;

/**
 * @member {String} value
 */
SearchResponseModelMerchandisingContentInline.prototype['value'] = undefined;





export default SearchResponseModelMerchandisingContentInline;

