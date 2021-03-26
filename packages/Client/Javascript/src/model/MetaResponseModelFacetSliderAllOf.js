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
 * The MetaResponseModelFacetSliderAllOf model module.
 * @module model/MetaResponseModelFacetSliderAllOf
 * @version 0.1.13
 */
class MetaResponseModelFacetSliderAllOf {
    /**
     * Constructs a new <code>MetaResponseModelFacetSliderAllOf</code>.
     * @alias module:model/MetaResponseModelFacetSliderAllOf
     */
    constructor() { 
        
        MetaResponseModelFacetSliderAllOf.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>MetaResponseModelFacetSliderAllOf</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MetaResponseModelFacetSliderAllOf} obj Optional instance to populate.
     * @return {module:model/MetaResponseModelFacetSliderAllOf} The populated <code>MetaResponseModelFacetSliderAllOf</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new MetaResponseModelFacetSliderAllOf();

            if (data.hasOwnProperty('formatSeparator')) {
                obj['formatSeparator'] = ApiClient.convertToType(data['formatSeparator'], 'String');
            }
            if (data.hasOwnProperty('formatValue')) {
                obj['formatValue'] = ApiClient.convertToType(data['formatValue'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {String} formatSeparator
 */
MetaResponseModelFacetSliderAllOf.prototype['formatSeparator'] = undefined;

/**
 * @member {String} formatValue
 */
MetaResponseModelFacetSliderAllOf.prototype['formatValue'] = undefined;





export default MetaResponseModelFacetSliderAllOf;

