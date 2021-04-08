/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import AutocompleteResponseModelAllOfAutocompleteAlternatives from './AutocompleteResponseModelAllOfAutocompleteAlternatives';
import AutocompleteResponseModelAllOfAutocompleteSuggested from './AutocompleteResponseModelAllOfAutocompleteSuggested';

/**
 * The AutocompleteResponseModelAllOfAutocomplete model module.
 * @module model/AutocompleteResponseModelAllOfAutocomplete
 * @version 0.1.13
 */
class AutocompleteResponseModelAllOfAutocomplete {
	/**
	 * Constructs a new <code>AutocompleteResponseModelAllOfAutocomplete</code>.
	 * @alias module:model/AutocompleteResponseModelAllOfAutocomplete
	 */
	constructor() {
		AutocompleteResponseModelAllOfAutocomplete.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>AutocompleteResponseModelAllOfAutocomplete</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/AutocompleteResponseModelAllOfAutocomplete} obj Optional instance to populate.
	 * @return {module:model/AutocompleteResponseModelAllOfAutocomplete} The populated <code>AutocompleteResponseModelAllOfAutocomplete</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new AutocompleteResponseModelAllOfAutocomplete();

			if (data.hasOwnProperty('query')) {
				obj['query'] = ApiClient.convertToType(data['query'], 'String');
			}
			if (data.hasOwnProperty('correctedQuery')) {
				obj['correctedQuery'] = ApiClient.convertToType(data['correctedQuery'], 'String');
			}
			if (data.hasOwnProperty('suggested')) {
				obj['suggested'] = AutocompleteResponseModelAllOfAutocompleteSuggested.constructFromObject(data['suggested']);
			}
			if (data.hasOwnProperty('alternatives')) {
				obj['alternatives'] = ApiClient.convertToType(data['alternatives'], [AutocompleteResponseModelAllOfAutocompleteAlternatives]);
			}
		}
		return obj;
	}
}

/**
 * @member {String} query
 */
AutocompleteResponseModelAllOfAutocomplete.prototype['query'] = undefined;

/**
 * @member {String} correctedQuery
 */
AutocompleteResponseModelAllOfAutocomplete.prototype['correctedQuery'] = undefined;

/**
 * @member {module:model/AutocompleteResponseModelAllOfAutocompleteSuggested} suggested
 */
AutocompleteResponseModelAllOfAutocomplete.prototype['suggested'] = undefined;

/**
 * @member {Array.<module:model/AutocompleteResponseModelAllOfAutocompleteAlternatives>} alternatives
 */
AutocompleteResponseModelAllOfAutocomplete.prototype['alternatives'] = undefined;

export default AutocompleteResponseModelAllOfAutocomplete;
