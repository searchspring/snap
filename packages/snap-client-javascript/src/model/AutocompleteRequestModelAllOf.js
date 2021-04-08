/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import AutocompleteRequestModelSuggestions from './AutocompleteRequestModelSuggestions';

/**
 * The AutocompleteRequestModelAllOf model module.
 * @module model/AutocompleteRequestModelAllOf
 * @version 0.1.13
 */
class AutocompleteRequestModelAllOf {
	/**
	 * Constructs a new <code>AutocompleteRequestModelAllOf</code>.
	 * @alias module:model/AutocompleteRequestModelAllOf
	 */
	constructor() {
		AutocompleteRequestModelAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>AutocompleteRequestModelAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/AutocompleteRequestModelAllOf} obj Optional instance to populate.
	 * @return {module:model/AutocompleteRequestModelAllOf} The populated <code>AutocompleteRequestModelAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new AutocompleteRequestModelAllOf();

			if (data.hasOwnProperty('suggestions')) {
				obj['suggestions'] = AutocompleteRequestModelSuggestions.constructFromObject(data['suggestions']);
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/AutocompleteRequestModelSuggestions} suggestions
 */
AutocompleteRequestModelAllOf.prototype['suggestions'] = undefined;

export default AutocompleteRequestModelAllOf;
