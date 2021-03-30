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
 * The SearchResponseModelResultCoreMappings model module.
 * @module model/SearchResponseModelResultCoreMappings
 * @version 0.1.13
 */
class SearchResponseModelResultCoreMappings {
    /**
     * Constructs a new <code>SearchResponseModelResultCoreMappings</code>.
     * Mapping of core fields for the result object
     * @alias module:model/SearchResponseModelResultCoreMappings
     */
    constructor() { 
        
        SearchResponseModelResultCoreMappings.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelResultCoreMappings</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelResultCoreMappings} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelResultCoreMappings} The populated <code>SearchResponseModelResultCoreMappings</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelResultCoreMappings();

            if (data.hasOwnProperty('uid')) {
                obj['uid'] = ApiClient.convertToType(data['uid'], 'String');
            }
            if (data.hasOwnProperty('price')) {
                obj['price'] = ApiClient.convertToType(data['price'], 'Number');
            }
            if (data.hasOwnProperty('msrp')) {
                obj['msrp'] = ApiClient.convertToType(data['msrp'], 'Number');
            }
            if (data.hasOwnProperty('url')) {
                obj['url'] = ApiClient.convertToType(data['url'], 'String');
            }
            if (data.hasOwnProperty('thumbnailImageUrl')) {
                obj['thumbnailImageUrl'] = ApiClient.convertToType(data['thumbnailImageUrl'], 'String');
            }
            if (data.hasOwnProperty('imageUrl')) {
                obj['imageUrl'] = ApiClient.convertToType(data['imageUrl'], 'String');
            }
            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('sku')) {
                obj['sku'] = ApiClient.convertToType(data['sku'], 'String');
            }
            if (data.hasOwnProperty('brand')) {
                obj['brand'] = ApiClient.convertToType(data['brand'], 'String');
            }

        }
        return obj;
    }


}

/**
 * Unique identifier of result
 * @member {String} uid
 */
SearchResponseModelResultCoreMappings.prototype['uid'] = undefined;

/**
 * Normal price of result
 * @member {Number} price
 */
SearchResponseModelResultCoreMappings.prototype['price'] = undefined;

/**
 * MSRP price of result
 * @member {Number} msrp
 */
SearchResponseModelResultCoreMappings.prototype['msrp'] = undefined;

/**
 * URL of result
 * @member {String} url
 */
SearchResponseModelResultCoreMappings.prototype['url'] = undefined;

/**
 * Smaller thumbnail image URL for result
 * @member {String} thumbnailImageUrl
 */
SearchResponseModelResultCoreMappings.prototype['thumbnailImageUrl'] = undefined;

/**
 * Normal thumbnail image URL for result
 * @member {String} imageUrl
 */
SearchResponseModelResultCoreMappings.prototype['imageUrl'] = undefined;

/**
 * Name for result
 * @member {String} name
 */
SearchResponseModelResultCoreMappings.prototype['name'] = undefined;

/**
 * SKU for result
 * @member {String} sku
 */
SearchResponseModelResultCoreMappings.prototype['sku'] = undefined;

/**
 * Brand of result
 * @member {String} brand
 */
SearchResponseModelResultCoreMappings.prototype['brand'] = undefined;





export default SearchResponseModelResultCoreMappings;

