/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import AutocompleteResponseModelAllOfAutocomplete from './AutocompleteResponseModelAllOfAutocomplete';

/**
 * The AutocompleteResponseModelAllOf model module.
 * @module model/AutocompleteResponseModelAllOf
 * @version 0.1.13
 */
class AutocompleteResponseModelAllOf {
	/**
	 * Constructs a new <code>AutocompleteResponseModelAllOf</code>.
	 * @alias module:model/AutocompleteResponseModelAllOf
	 */
	constructor() {
		AutocompleteResponseModelAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>AutocompleteResponseModelAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/AutocompleteResponseModelAllOf} obj Optional instance to populate.
	 * @return {module:model/AutocompleteResponseModelAllOf} The populated <code>AutocompleteResponseModelAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new AutocompleteResponseModelAllOf();

			if (data.hasOwnProperty('autocomplete')) {
				obj['autocomplete'] = AutocompleteResponseModelAllOfAutocomplete.constructFromObject(data['autocomplete']);
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/AutocompleteResponseModelAllOfAutocomplete} autocomplete
 */
AutocompleteResponseModelAllOf.prototype['autocomplete'] = undefined;

export default AutocompleteResponseModelAllOf;
