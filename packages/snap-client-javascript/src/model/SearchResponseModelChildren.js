/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelMappings from './SearchResponseModelMappings';

/**
 * The SearchResponseModelChildren model module.
 * @module model/SearchResponseModelChildren
 * @version 0.1.13
 */
class SearchResponseModelChildren {
	/**
	 * Constructs a new <code>SearchResponseModelChildren</code>.
	 * @alias module:model/SearchResponseModelChildren
	 */
	constructor() {
		SearchResponseModelChildren.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelChildren</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelChildren} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelChildren} The populated <code>SearchResponseModelChildren</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelChildren();

			if (data.hasOwnProperty('mappings')) {
				obj['mappings'] = SearchResponseModelMappings.constructFromObject(data['mappings']);
			}
			if (data.hasOwnProperty('attributes')) {
				obj['attributes'] = ApiClient.convertToType(data['attributes'], { String: Object });
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/SearchResponseModelMappings} mappings
 */
SearchResponseModelChildren.prototype['mappings'] = undefined;

/**
 * Additional fields for results - these are site specific fields which can have various value types
 * @member {Object.<String, Object>} attributes
 */
SearchResponseModelChildren.prototype['attributes'] = undefined;

export default SearchResponseModelChildren;
