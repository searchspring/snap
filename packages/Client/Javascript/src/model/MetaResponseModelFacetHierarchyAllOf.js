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
 * The MetaResponseModelFacetHierarchyAllOf model module.
 * @module model/MetaResponseModelFacetHierarchyAllOf
 * @version 0.1.13
 */
class MetaResponseModelFacetHierarchyAllOf {
    /**
     * Constructs a new <code>MetaResponseModelFacetHierarchyAllOf</code>.
     * @alias module:model/MetaResponseModelFacetHierarchyAllOf
     */
    constructor() { 
        
        MetaResponseModelFacetHierarchyAllOf.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>MetaResponseModelFacetHierarchyAllOf</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MetaResponseModelFacetHierarchyAllOf} obj Optional instance to populate.
     * @return {module:model/MetaResponseModelFacetHierarchyAllOf} The populated <code>MetaResponseModelFacetHierarchyAllOf</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new MetaResponseModelFacetHierarchyAllOf();

            if (data.hasOwnProperty('hierarchyDelimiter')) {
                obj['hierarchyDelimiter'] = ApiClient.convertToType(data['hierarchyDelimiter'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {String} hierarchyDelimiter
 */
MetaResponseModelFacetHierarchyAllOf.prototype['hierarchyDelimiter'] = undefined;





export default MetaResponseModelFacetHierarchyAllOf;

