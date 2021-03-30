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
 * The SearchResponseModelFacetRangeBucketsAllOfValues model module.
 * @module model/SearchResponseModelFacetRangeBucketsAllOfValues
 * @version 0.1.13
 */
class SearchResponseModelFacetRangeBucketsAllOfValues {
    /**
     * Constructs a new <code>SearchResponseModelFacetRangeBucketsAllOfValues</code>.
     * @alias module:model/SearchResponseModelFacetRangeBucketsAllOfValues
     */
    constructor() { 
        
        SearchResponseModelFacetRangeBucketsAllOfValues.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelFacetRangeBucketsAllOfValues</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelFacetRangeBucketsAllOfValues} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelFacetRangeBucketsAllOfValues} The populated <code>SearchResponseModelFacetRangeBucketsAllOfValues</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelFacetRangeBucketsAllOfValues();

            if (data.hasOwnProperty('filtered')) {
                obj['filtered'] = ApiClient.convertToType(data['filtered'], 'Boolean');
            }
            if (data.hasOwnProperty('low')) {
                obj['low'] = ApiClient.convertToType(data['low'], 'Number');
            }
            if (data.hasOwnProperty('high')) {
                obj['high'] = ApiClient.convertToType(data['high'], 'Number');
            }
            if (data.hasOwnProperty('label')) {
                obj['label'] = ApiClient.convertToType(data['label'], 'String');
            }
            if (data.hasOwnProperty('count')) {
                obj['count'] = ApiClient.convertToType(data['count'], 'Number');
            }

        }
        return obj;
    }


}

/**
 * @member {Boolean} filtered
 */
SearchResponseModelFacetRangeBucketsAllOfValues.prototype['filtered'] = undefined;

/**
 * @member {Number} low
 */
SearchResponseModelFacetRangeBucketsAllOfValues.prototype['low'] = undefined;

/**
 * @member {Number} high
 */
SearchResponseModelFacetRangeBucketsAllOfValues.prototype['high'] = undefined;

/**
 * @member {String} label
 */
SearchResponseModelFacetRangeBucketsAllOfValues.prototype['label'] = undefined;

/**
 * @member {Number} count
 */
SearchResponseModelFacetRangeBucketsAllOfValues.prototype['count'] = undefined;





export default SearchResponseModelFacetRangeBucketsAllOfValues;

