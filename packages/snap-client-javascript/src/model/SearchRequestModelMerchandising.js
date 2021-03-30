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
 * The SearchRequestModelMerchandising model module.
 * @module model/SearchRequestModelMerchandising
 * @version 0.1.13
 */
class SearchRequestModelMerchandising {
    /**
     * Constructs a new <code>SearchRequestModelMerchandising</code>.
     * @alias module:model/SearchRequestModelMerchandising
     */
    constructor() { 
        
        SearchRequestModelMerchandising.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchRequestModelMerchandising</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchRequestModelMerchandising} obj Optional instance to populate.
     * @return {module:model/SearchRequestModelMerchandising} The populated <code>SearchRequestModelMerchandising</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchRequestModelMerchandising();

            if (data.hasOwnProperty('disabled')) {
                obj['disabled'] = ApiClient.convertToType(data['disabled'], 'Boolean');
            }
            if (data.hasOwnProperty('segments')) {
                obj['segments'] = ApiClient.convertToType(data['segments'], ['String']);
            }
            if (data.hasOwnProperty('landingPage')) {
                obj['landingPage'] = ApiClient.convertToType(data['landingPage'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {Boolean} disabled
 */
SearchRequestModelMerchandising.prototype['disabled'] = undefined;

/**
 * @member {Array.<String>} segments
 */
SearchRequestModelMerchandising.prototype['segments'] = undefined;

/**
 * @member {String} landingPage
 */
SearchRequestModelMerchandising.prototype['landingPage'] = undefined;





export default SearchRequestModelMerchandising;

