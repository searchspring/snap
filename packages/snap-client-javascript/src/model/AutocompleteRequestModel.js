/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import AutocompleteRequestModelAllOf from './AutocompleteRequestModelAllOf';
import AutocompleteRequestModelSuggestions from './AutocompleteRequestModelSuggestions';
import SearchRequestModel from './SearchRequestModel';
import SearchRequestModelFacets from './SearchRequestModelFacets';
import SearchRequestModelFilter from './SearchRequestModelFilter';
import SearchRequestModelMerchandising from './SearchRequestModelMerchandising';
import SearchRequestModelPagination from './SearchRequestModelPagination';
import SearchRequestModelSearch from './SearchRequestModelSearch';
import SearchRequestModelSorts from './SearchRequestModelSorts';
import SearchRequestModelTracking from './SearchRequestModelTracking';

/**
 * The AutocompleteRequestModel model module.
 * @module model/AutocompleteRequestModel
 * @version 0.1.13
 */
class AutocompleteRequestModel {
	/**
	 * Constructs a new <code>AutocompleteRequestModel</code>.
	 * @alias module:model/AutocompleteRequestModel
	 * @implements module:model/AutocompleteRequestModelAllOf
	 * @implements module:model/SearchRequestModel
	 */
	constructor() {
		AutocompleteRequestModelAllOf.initialize(this);
		SearchRequestModel.initialize(this);
		AutocompleteRequestModel.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>AutocompleteRequestModel</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/AutocompleteRequestModel} obj Optional instance to populate.
	 * @return {module:model/AutocompleteRequestModel} The populated <code>AutocompleteRequestModel</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new AutocompleteRequestModel();

			if (data.hasOwnProperty('suggestions')) {
				obj['suggestions'] = AutocompleteRequestModelSuggestions.constructFromObject(data['suggestions']);
			}
			if (data.hasOwnProperty('siteId')) {
				obj['siteId'] = ApiClient.convertToType(data['siteId'], 'String');
			}
			if (data.hasOwnProperty('sorts')) {
				obj['sorts'] = ApiClient.convertToType(data['sorts'], [SearchRequestModelSorts]);
			}
			if (data.hasOwnProperty('search')) {
				obj['search'] = SearchRequestModelSearch.constructFromObject(data['search']);
			}
			if (data.hasOwnProperty('filters')) {
				obj['filters'] = ApiClient.convertToType(data['filters'], [SearchRequestModelFilter]);
			}
			if (data.hasOwnProperty('pagination')) {
				obj['pagination'] = SearchRequestModelPagination.constructFromObject(data['pagination']);
			}
			if (data.hasOwnProperty('facets')) {
				obj['facets'] = SearchRequestModelFacets.constructFromObject(data['facets']);
			}
			if (data.hasOwnProperty('merchandising')) {
				obj['merchandising'] = SearchRequestModelMerchandising.constructFromObject(data['merchandising']);
			}
			if (data.hasOwnProperty('tracking')) {
				obj['tracking'] = SearchRequestModelTracking.constructFromObject(data['tracking']);
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/AutocompleteRequestModelSuggestions} suggestions
 */
AutocompleteRequestModel.prototype['suggestions'] = undefined;

/**
 * @member {String} siteId
 */
AutocompleteRequestModel.prototype['siteId'] = undefined;

/**
 * @member {Array.<module:model/SearchRequestModelSorts>} sorts
 */
AutocompleteRequestModel.prototype['sorts'] = undefined;

/**
 * @member {module:model/SearchRequestModelSearch} search
 */
AutocompleteRequestModel.prototype['search'] = undefined;

/**
 * @member {Array.<module:model/SearchRequestModelFilter>} filters
 */
AutocompleteRequestModel.prototype['filters'] = undefined;

/**
 * @member {module:model/SearchRequestModelPagination} pagination
 */
AutocompleteRequestModel.prototype['pagination'] = undefined;

/**
 * @member {module:model/SearchRequestModelFacets} facets
 */
AutocompleteRequestModel.prototype['facets'] = undefined;

/**
 * @member {module:model/SearchRequestModelMerchandising} merchandising
 */
AutocompleteRequestModel.prototype['merchandising'] = undefined;

/**
 * @member {module:model/SearchRequestModelTracking} tracking
 */
AutocompleteRequestModel.prototype['tracking'] = undefined;

export default AutocompleteRequestModel;
