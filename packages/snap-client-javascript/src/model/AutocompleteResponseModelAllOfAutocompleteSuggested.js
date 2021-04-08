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
 * The AutocompleteResponseModelAllOfAutocompleteSuggested model module.
 * @module model/AutocompleteResponseModelAllOfAutocompleteSuggested
 * @version 0.1.13
 */
class AutocompleteResponseModelAllOfAutocompleteSuggested {
	/**
	 * Constructs a new <code>AutocompleteResponseModelAllOfAutocompleteSuggested</code>.
	 * @alias module:model/AutocompleteResponseModelAllOfAutocompleteSuggested
	 */
	constructor() {
		AutocompleteResponseModelAllOfAutocompleteSuggested.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>AutocompleteResponseModelAllOfAutocompleteSuggested</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/AutocompleteResponseModelAllOfAutocompleteSuggested} obj Optional instance to populate.
	 * @return {module:model/AutocompleteResponseModelAllOfAutocompleteSuggested} The populated <code>AutocompleteResponseModelAllOfAutocompleteSuggested</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new AutocompleteResponseModelAllOfAutocompleteSuggested();

			if (data.hasOwnProperty('text')) {
				obj['text'] = ApiClient.convertToType(data['text'], 'String');
			}
			if (data.hasOwnProperty('type')) {
				obj['type'] = ApiClient.convertToType(data['type'], 'String');
			}
			if (data.hasOwnProperty('source')) {
				obj['source'] = ApiClient.convertToType(data['source'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} text
 */
AutocompleteResponseModelAllOfAutocompleteSuggested.prototype['text'] = undefined;

/**
 * @member {String} type
 */
AutocompleteResponseModelAllOfAutocompleteSuggested.prototype['type'] = undefined;

/**
 * @member {String} source
 */
AutocompleteResponseModelAllOfAutocompleteSuggested.prototype['source'] = undefined;

export default AutocompleteResponseModelAllOfAutocompleteSuggested;
