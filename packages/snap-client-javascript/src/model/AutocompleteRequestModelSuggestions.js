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
 * The AutocompleteRequestModelSuggestions model module.
 * @module model/AutocompleteRequestModelSuggestions
 * @version 0.1.13
 */
class AutocompleteRequestModelSuggestions {
    /**
     * Constructs a new <code>AutocompleteRequestModelSuggestions</code>.
     * @alias module:model/AutocompleteRequestModelSuggestions
     */
    constructor() { 
        
        AutocompleteRequestModelSuggestions.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>AutocompleteRequestModelSuggestions</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AutocompleteRequestModelSuggestions} obj Optional instance to populate.
     * @return {module:model/AutocompleteRequestModelSuggestions} The populated <code>AutocompleteRequestModelSuggestions</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new AutocompleteRequestModelSuggestions();

            if (data.hasOwnProperty('count')) {
                obj['count'] = ApiClient.convertToType(data['count'], 'Number');
            }

        }
        return obj;
    }


}

/**
 * @member {Number} count
 */
AutocompleteRequestModelSuggestions.prototype['count'] = undefined;





export default AutocompleteRequestModelSuggestions;

