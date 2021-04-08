/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelChildren from './SearchResponseModelChildren';
import SearchResponseModelMappings from './SearchResponseModelMappings';

/**
 * The SearchResponseModelResults model module.
 * @module model/SearchResponseModelResults
 * @version 0.1.13
 */
class SearchResponseModelResults {
	/**
	 * Constructs a new <code>SearchResponseModelResults</code>.
	 * @alias module:model/SearchResponseModelResults
	 */
	constructor() {
		SearchResponseModelResults.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelResults</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelResults} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelResults} The populated <code>SearchResponseModelResults</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelResults();

			if (data.hasOwnProperty('id')) {
				obj['id'] = ApiClient.convertToType(data['id'], 'String');
			}
			if (data.hasOwnProperty('mappings')) {
				obj['mappings'] = SearchResponseModelMappings.constructFromObject(data['mappings']);
			}
			if (data.hasOwnProperty('attributes')) {
				obj['attributes'] = ApiClient.convertToType(data['attributes'], { String: Object });
			}
			if (data.hasOwnProperty('children')) {
				obj['children'] = ApiClient.convertToType(data['children'], [SearchResponseModelChildren]);
			}
		}
		return obj;
	}
}

/**
 * @member {String} id
 */
SearchResponseModelResults.prototype['id'] = undefined;

/**
 * @member {module:model/SearchResponseModelMappings} mappings
 */
SearchResponseModelResults.prototype['mappings'] = undefined;

/**
 * Additional fields for results - these are site specific fields which can have various value types
 * @member {Object.<String, Object>} attributes
 */
SearchResponseModelResults.prototype['attributes'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelChildren>} children
 */
SearchResponseModelResults.prototype['children'] = undefined;

export default SearchResponseModelResults;
