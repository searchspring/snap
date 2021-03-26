/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
/* import for discriminator */
import SearchResponseModelFacetRange from './SearchResponseModelFacetRange';
import SearchResponseModelFacetRangeBuckets from './SearchResponseModelFacetRangeBuckets';
import SearchResponseModelFacetValue from './SearchResponseModelFacetValue';


/**
 * The SearchResponseModelFacet model module.
 * @module model/SearchResponseModelFacet
 * @version 0.1.13
 */
class SearchResponseModelFacet {
    /**
     * Constructs a new <code>SearchResponseModelFacet</code>.
     * @alias module:model/SearchResponseModelFacet
     * @param type {String} 
     */
    constructor(type) { 
        
        SearchResponseModelFacet.initialize(this, type);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, type) { 
        obj['type'] = type;
    }

    /**
     * Constructs a <code>SearchResponseModelFacet</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelFacet} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelFacet} The populated <code>SearchResponseModelFacet</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelFacet();

            if (data.hasOwnProperty('type')) {
                obj['type'] = ApiClient.convertToType(data['type'], 'String');
            }
            if (data.hasOwnProperty('field')) {
                obj['field'] = ApiClient.convertToType(data['field'], 'String');
            }
            if (data.hasOwnProperty('filtered')) {
                obj['filtered'] = ApiClient.convertToType(data['filtered'], 'Boolean');
            }

            switch (obj['type']) {
                case 'range':
                    SearchResponseModelFacetRange.constructFromObject(data, obj);
                    break;
                case 'range-buckets':
                    SearchResponseModelFacetRangeBuckets.constructFromObject(data, obj);
                    break;
                case 'value':
                    SearchResponseModelFacetValue.constructFromObject(data, obj);
                    break;
                default:
                    break;
            }
        }
        return obj;
    }


}

/**
 * @member {String} type
 */
SearchResponseModelFacet.prototype['type'] = undefined;

/**
 * @member {String} field
 */
SearchResponseModelFacet.prototype['field'] = undefined;

/**
 * @member {Boolean} filtered
 */
SearchResponseModelFacet.prototype['filtered'] = undefined;





export default SearchResponseModelFacet;

