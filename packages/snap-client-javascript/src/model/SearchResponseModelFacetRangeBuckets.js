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
import SearchResponseModelFacetRangeBucketsAllOf from './SearchResponseModelFacetRangeBucketsAllOf';
import SearchResponseModelFacetRangeBucketsAllOfValues from './SearchResponseModelFacetRangeBucketsAllOfValues';

/**
 * The SearchResponseModelFacetRangeBuckets model module.
 * @module model/SearchResponseModelFacetRangeBuckets
 * @version 0.1.13
 */
class SearchResponseModelFacetRangeBuckets {
	/**
	 * Constructs a new <code>SearchResponseModelFacetRangeBuckets</code>.
	 * @alias module:model/SearchResponseModelFacetRangeBuckets
	 * @extends module:model/SearchResponseModelFacet
	 * @implements module:model/SearchResponseModelFacet
	 * @implements module:model/SearchResponseModelFacetRangeBucketsAllOf
	 * @param type {String}
	 */
	constructor(type) {
		SearchResponseModelFacet.initialize(this, type);
		SearchResponseModelFacetRangeBucketsAllOf.initialize(this);
		SearchResponseModelFacetRangeBuckets.initialize(this, type);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, type) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetRangeBuckets</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetRangeBuckets} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetRangeBuckets} The populated <code>SearchResponseModelFacetRangeBuckets</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetRangeBuckets();

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
SearchResponseModelFacetRangeBuckets.prototype['values'] = undefined;

export default SearchResponseModelFacetRangeBuckets;
