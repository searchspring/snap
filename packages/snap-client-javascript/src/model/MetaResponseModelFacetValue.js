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
 * The MetaResponseModelFacetValue model module.
 * @module model/MetaResponseModelFacetValue
 * @version 0.1.13
 */
class MetaResponseModelFacetValue {
    /**
     * Constructs a new <code>MetaResponseModelFacetValue</code>.
     * @alias module:model/MetaResponseModelFacetValue
     */
    constructor() { 
        
        MetaResponseModelFacetValue.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>MetaResponseModelFacetValue</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MetaResponseModelFacetValue} obj Optional instance to populate.
     * @return {module:model/MetaResponseModelFacetValue} The populated <code>MetaResponseModelFacetValue</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new MetaResponseModelFacetValue();

            if (data.hasOwnProperty('multiple')) {
                obj['multiple'] = ApiClient.convertToType(data['multiple'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {module:model/MetaResponseModelFacetValue.MultipleEnum} multiple
 */
MetaResponseModelFacetValue.prototype['multiple'] = undefined;




/**
 * Allowed values for the <code>multiple</code> property.
 * @enum {String}
 * @readonly
 */
MetaResponseModelFacetValue['MultipleEnum'] = {

    /**
     * value: "single"
     * @const
     */
    "single": "single",

    /**
     * value: "or"
     * @const
     */
    "or": "or",

    /**
     * value: "and"
     * @const
     */
    "and": "and"
};



export default MetaResponseModelFacetValue;

