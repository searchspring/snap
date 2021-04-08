/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelFacet from './SearchResponseModelFacet';
import SearchResponseModelFilter from './SearchResponseModelFilter';
import SearchResponseModelMerchandising from './SearchResponseModelMerchandising';
import SearchResponseModelPagination from './SearchResponseModelPagination';
import SearchResponseModelResults from './SearchResponseModelResults';
import SearchResponseModelSearch from './SearchResponseModelSearch';
import SearchResponseModelSorting from './SearchResponseModelSorting';

/**
 * The SearchResponseModel model module.
 * @module model/SearchResponseModel
 * @version 0.1.13
 */
class SearchResponseModel {
	/**
	 * Constructs a new <code>SearchResponseModel</code>.
	 * @alias module:model/SearchResponseModel
	 */
	constructor() {
		SearchResponseModel.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModel</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModel} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModel} The populated <code>SearchResponseModel</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModel();

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
 * @member {module:model/SearchResponseModelSearch} search
 */
SearchResponseModel.prototype['search'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelFilter>} filters
 */
SearchResponseModel.prototype['filters'] = undefined;

/**
 * @member {module:model/SearchResponseModelPagination} pagination
 */
SearchResponseModel.prototype['pagination'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelSorting>} sorting
 */
SearchResponseModel.prototype['sorting'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelResults>} results
 */
SearchResponseModel.prototype['results'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelFacet>} facets
 */
SearchResponseModel.prototype['facets'] = undefined;

/**
 * @member {module:model/SearchResponseModelMerchandising} merchandising
 */
SearchResponseModel.prototype['merchandising'] = undefined;

export default SearchResponseModel;
