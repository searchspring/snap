/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import AutocompleteResponseModelAllOf from './AutocompleteResponseModelAllOf';
import AutocompleteResponseModelAllOfAutocomplete from './AutocompleteResponseModelAllOfAutocomplete';
import SearchResponseModel from './SearchResponseModel';
import SearchResponseModelFacet from './SearchResponseModelFacet';
import SearchResponseModelFilter from './SearchResponseModelFilter';
import SearchResponseModelMerchandising from './SearchResponseModelMerchandising';
import SearchResponseModelPagination from './SearchResponseModelPagination';
import SearchResponseModelResults from './SearchResponseModelResults';
import SearchResponseModelSearch from './SearchResponseModelSearch';
import SearchResponseModelSorting from './SearchResponseModelSorting';

/**
 * The AutocompleteResponseModel model module.
 * @module model/AutocompleteResponseModel
 * @version 0.1.13
 */
class AutocompleteResponseModel {
	/**
	 * Constructs a new <code>AutocompleteResponseModel</code>.
	 * @alias module:model/AutocompleteResponseModel
	 * @implements module:model/AutocompleteResponseModelAllOf
	 * @implements module:model/SearchResponseModel
	 */
	constructor() {
		AutocompleteResponseModelAllOf.initialize(this);
		SearchResponseModel.initialize(this);
		AutocompleteResponseModel.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>AutocompleteResponseModel</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/AutocompleteResponseModel} obj Optional instance to populate.
	 * @return {module:model/AutocompleteResponseModel} The populated <code>AutocompleteResponseModel</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new AutocompleteResponseModel();

			if (data.hasOwnProperty('autocomplete')) {
				obj['autocomplete'] = AutocompleteResponseModelAllOfAutocomplete.constructFromObject(data['autocomplete']);
			}
			if (data.hasOwnProperty('search')) {
				obj['search'] = SearchResponseModelSearch.constructFromObject(data['search']);
			}
			if (data.hasOwnProperty('filters')) {
				obj['filters'] = ApiClient.convertToType(data['filters'], [SearchResponseModelFilter]);
			}
			if (data.hasOwnProperty('pagination')) {
				obj['pagination'] = SearchResponseModelPagination.constructFromObject(data['pagination']);
			}
			if (data.hasOwnProperty('sorting')) {
				obj['sorting'] = ApiClient.convertToType(data['sorting'], [SearchResponseModelSorting]);
			}
			if (data.hasOwnProperty('results')) {
				obj['results'] = ApiClient.convertToType(data['results'], [SearchResponseModelResults]);
			}
			if (data.hasOwnProperty('facets')) {
				obj['facets'] = ApiClient.convertToType(data['facets'], [SearchResponseModelFacet]);
			}
			if (data.hasOwnProperty('merchandising')) {
				obj['merchandising'] = SearchResponseModelMerchandising.constructFromObject(data['merchandising']);
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/AutocompleteResponseModelAllOfAutocomplete} autocomplete
 */
AutocompleteResponseModel.prototype['autocomplete'] = undefined;

/**
 * @member {module:model/SearchResponseModelSearch} search
 */
AutocompleteResponseModel.prototype['search'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelFilter>} filters
 */
AutocompleteResponseModel.prototype['filters'] = undefined;

/**
 * @member {module:model/SearchResponseModelPagination} pagination
 */
AutocompleteResponseModel.prototype['pagination'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelSorting>} sorting
 */
AutocompleteResponseModel.prototype['sorting'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelResults>} results
 */
AutocompleteResponseModel.prototype['results'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelFacet>} facets
 */
AutocompleteResponseModel.prototype['facets'] = undefined;

/**
 * @member {module:model/SearchResponseModelMerchandising} merchandising
 */
AutocompleteResponseModel.prototype['merchandising'] = undefined;

export default AutocompleteResponseModel;
