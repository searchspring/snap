/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelFacetValueAllOfValues from './SearchResponseModelFacetValueAllOfValues';

/**
 * The SearchResponseModelFacetValueAllOf model module.
 * @module model/SearchResponseModelFacetValueAllOf
 * @version 0.1.13
 */
class SearchResponseModelFacetValueAllOf {
	/**
	 * Constructs a new <code>SearchResponseModelFacetValueAllOf</code>.
	 * @alias module:model/SearchResponseModelFacetValueAllOf
	 */
	constructor() {
		SearchResponseModelFacetValueAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetValueAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetValueAllOf} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetValueAllOf} The populated <code>SearchResponseModelFacetValueAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetValueAllOf();

			if (data.hasOwnProperty('values')) {
				obj['values'] = ApiClient.convertToType(data['values'], [SearchResponseModelFacetValueAllOfValues]);
			}
		}
		return obj;
	}
}

/**
 * @member {Array.<module:model/SearchResponseModelFacetValueAllOfValues>} values
 */
SearchResponseModelFacetValueAllOf.prototype['values'] = undefined;

export default SearchResponseModelFacetValueAllOf;
