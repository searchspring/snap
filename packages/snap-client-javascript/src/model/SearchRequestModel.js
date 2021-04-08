/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelFacets from './SearchRequestModelFacets';
import SearchRequestModelFilter from './SearchRequestModelFilter';
import SearchRequestModelMerchandising from './SearchRequestModelMerchandising';
import SearchRequestModelPagination from './SearchRequestModelPagination';
import SearchRequestModelSearch from './SearchRequestModelSearch';
import SearchRequestModelSorts from './SearchRequestModelSorts';
import SearchRequestModelTracking from './SearchRequestModelTracking';

/**
 * The SearchRequestModel model module.
 * @module model/SearchRequestModel
 * @version 0.1.13
 */
class SearchRequestModel {
	/**
	 * Constructs a new <code>SearchRequestModel</code>.
	 * @alias module:model/SearchRequestModel
	 */
	constructor() {
		SearchRequestModel.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchRequestModel</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModel} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModel} The populated <code>SearchRequestModel</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModel();

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
 * @member {String} siteId
 */
SearchRequestModel.prototype['siteId'] = undefined;

/**
 * @member {Array.<module:model/SearchRequestModelSorts>} sorts
 */
SearchRequestModel.prototype['sorts'] = undefined;

/**
 * @member {module:model/SearchRequestModelSearch} search
 */
SearchRequestModel.prototype['search'] = undefined;

/**
 * @member {Array.<module:model/SearchRequestModelFilter>} filters
 */
SearchRequestModel.prototype['filters'] = undefined;

/**
 * @member {module:model/SearchRequestModelPagination} pagination
 */
SearchRequestModel.prototype['pagination'] = undefined;

/**
 * @member {module:model/SearchRequestModelFacets} facets
 */
SearchRequestModel.prototype['facets'] = undefined;

/**
 * @member {module:model/SearchRequestModelMerchandising} merchandising
 */
SearchRequestModel.prototype['merchandising'] = undefined;

/**
 * @member {module:model/SearchRequestModelTracking} tracking
 */
SearchRequestModel.prototype['tracking'] = undefined;

export default SearchRequestModel;
