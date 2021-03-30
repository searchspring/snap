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
 * The SearchResponseModelSorting model module.
 * @module model/SearchResponseModelSorting
 * @version 0.1.13
 */
class SearchResponseModelSorting {
    /**
     * Constructs a new <code>SearchResponseModelSorting</code>.
     * @alias module:model/SearchResponseModelSorting
     */
    constructor() { 
        
        SearchResponseModelSorting.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>SearchResponseModelSorting</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SearchResponseModelSorting} obj Optional instance to populate.
     * @return {module:model/SearchResponseModelSorting} The populated <code>SearchResponseModelSorting</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SearchResponseModelSorting();

            if (data.hasOwnProperty('field')) {
                obj['field'] = ApiClient.convertToType(data['field'], 'String');
            }
            if (data.hasOwnProperty('direction')) {
                obj['direction'] = ApiClient.convertToType(data['direction'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {String} field
 */
SearchResponseModelSorting.prototype['field'] = undefined;

/**
 * @member {module:model/SearchResponseModelSorting.DirectionEnum} direction
 */
SearchResponseModelSorting.prototype['direction'] = undefined;




/**
 * Allowed values for the <code>direction</code> property.
 * @enum {String}
 * @readonly
 */
SearchResponseModelSorting['DirectionEnum'] = {

    /**
     * value: "asc"
     * @const
     */
    "asc": "asc",

    /**
     * value: "desc"
     * @const
     */
    "desc": "desc"
};



export default SearchResponseModelSorting;

