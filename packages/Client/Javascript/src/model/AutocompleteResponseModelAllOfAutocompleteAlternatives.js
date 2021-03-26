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
 * The AutocompleteResponseModelAllOfAutocompleteAlternatives model module.
 * @module model/AutocompleteResponseModelAllOfAutocompleteAlternatives
 * @version 0.1.13
 */
class AutocompleteResponseModelAllOfAutocompleteAlternatives {
    /**
     * Constructs a new <code>AutocompleteResponseModelAllOfAutocompleteAlternatives</code>.
     * @alias module:model/AutocompleteResponseModelAllOfAutocompleteAlternatives
     */
    constructor() { 
        
        AutocompleteResponseModelAllOfAutocompleteAlternatives.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>AutocompleteResponseModelAllOfAutocompleteAlternatives</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AutocompleteResponseModelAllOfAutocompleteAlternatives} obj Optional instance to populate.
     * @return {module:model/AutocompleteResponseModelAllOfAutocompleteAlternatives} The populated <code>AutocompleteResponseModelAllOfAutocompleteAlternatives</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new AutocompleteResponseModelAllOfAutocompleteAlternatives();

            if (data.hasOwnProperty('text')) {
                obj['text'] = ApiClient.convertToType(data['text'], 'String');
            }

        }
        return obj;
    }


}

/**
 * @member {String} text
 */
AutocompleteResponseModelAllOfAutocompleteAlternatives.prototype['text'] = undefined;





export default AutocompleteResponseModelAllOfAutocompleteAlternatives;

