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
 * The SearchRequestModelPagination model module.
 * @module model/SearchRequestModelPagination
 * @version 0.1.13
 */
class SearchRequestModelPagination {
	/**
	 * Constructs a new <code>SearchRequestModelPagination</code>.
	 * @alias module:model/SearchRequestModelPagination
	 */
	constructor() {
		SearchRequestModelPagination.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchRequestModelPagination</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModelPagination} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModelPagination} The populated <code>SearchRequestModelPagination</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModelPagination();

			if (data.hasOwnProperty('page')) {
				obj['page'] = ApiClient.convertToType(data['page'], 'Number');
			}
			if (data.hasOwnProperty('pageSize')) {
				obj['pageSize'] = ApiClient.convertToType(data['pageSize'], 'Number');
			}
		}
		return obj;
	}
}

/**
 * @member {Number} page
 */
SearchRequestModelPagination.prototype['page'] = undefined;

/**
 * @member {Number} pageSize
 */
SearchRequestModelPagination.prototype['pageSize'] = undefined;

export default SearchRequestModelPagination;
