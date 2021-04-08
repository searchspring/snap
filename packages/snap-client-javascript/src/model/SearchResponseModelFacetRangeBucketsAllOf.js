/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelFacetRangeBucketsAllOfValues from './SearchResponseModelFacetRangeBucketsAllOfValues';

/**
 * The SearchResponseModelFacetRangeBucketsAllOf model module.
 * @module model/SearchResponseModelFacetRangeBucketsAllOf
 * @version 0.1.13
 */
class SearchResponseModelFacetRangeBucketsAllOf {
	/**
	 * Constructs a new <code>SearchResponseModelFacetRangeBucketsAllOf</code>.
	 * @alias module:model/SearchResponseModelFacetRangeBucketsAllOf
	 */
	constructor() {
		SearchResponseModelFacetRangeBucketsAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetRangeBucketsAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetRangeBucketsAllOf} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetRangeBucketsAllOf} The populated <code>SearchResponseModelFacetRangeBucketsAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetRangeBucketsAllOf();

			if (data.hasOwnProperty('values')) {
				obj['values'] = ApiClient.convertToType(data['values'], [SearchResponseModelFacetRangeBucketsAllOfValues]);
			}
		}
		return obj;
	}
}

/**
 * @member {Array.<module:model/SearchResponseModelFacetRangeBucketsAllOfValues>} values
 */
SearchResponseModelFacetRangeBucketsAllOf.prototype['values'] = undefined;

export default SearchResponseModelFacetRangeBucketsAllOf;
