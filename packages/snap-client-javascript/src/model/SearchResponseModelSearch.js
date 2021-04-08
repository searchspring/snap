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
 * The SearchResponseModelSearch model module.
 * @module model/SearchResponseModelSearch
 * @version 0.1.13
 */
class SearchResponseModelSearch {
	/**
	 * Constructs a new <code>SearchResponseModelSearch</code>.
	 * @alias module:model/SearchResponseModelSearch
	 */
	constructor() {
		SearchResponseModelSearch.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelSearch</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelSearch} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelSearch} The populated <code>SearchResponseModelSearch</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelSearch();

			if (data.hasOwnProperty('query')) {
				obj['query'] = ApiClient.convertToType(data['query'], 'String');
			}
			if (data.hasOwnProperty('didYouMean')) {
				obj['didYouMean'] = ApiClient.convertToType(data['didYouMean'], 'String');
			}
			if (data.hasOwnProperty('originalQuery')) {
				obj['originalQuery'] = ApiClient.convertToType(data['originalQuery'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} query
 */
SearchResponseModelSearch.prototype['query'] = undefined;

/**
 * The suggested query after spelling correction.
 * @member {String} didYouMean
 */
SearchResponseModelSearch.prototype['didYouMean'] = undefined;

/**
 * Original query if spell correction occured.
 * @member {String} originalQuery
 */
SearchResponseModelSearch.prototype['originalQuery'] = undefined;

export default SearchResponseModelSearch;
