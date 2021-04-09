/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelFilterRangeAllOfValue from './SearchRequestModelFilterRangeAllOfValue';
import SearchResponseModelFacet from './SearchResponseModelFacet';
import SearchResponseModelFacetRangeAllOf from './SearchResponseModelFacetRangeAllOf';

/**
 * The SearchResponseModelFacetRange model module.
 * @module model/SearchResponseModelFacetRange
 * @version 0.1.13
 */
class SearchResponseModelFacetRange {
	/**
	 * Constructs a new <code>SearchResponseModelFacetRange</code>.
	 * @alias module:model/SearchResponseModelFacetRange
	 * @extends module:model/SearchResponseModelFacet
	 * @implements module:model/SearchResponseModelFacet
	 * @implements module:model/SearchResponseModelFacetRangeAllOf
	 * @param type {String}
	 */
	constructor(type) {
		SearchResponseModelFacet.initialize(this, type);
		SearchResponseModelFacetRangeAllOf.initialize(this);
		SearchResponseModelFacetRange.initialize(this, type);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, type) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetRange</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetRange} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetRange} The populated <code>SearchResponseModelFacetRange</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetRange();

			if (data.hasOwnProperty('step')) {
				obj['step'] = ApiClient.convertToType(data['step'], 'Number');
			}
			if (data.hasOwnProperty('range')) {
				obj['range'] = SearchRequestModelFilterRangeAllOfValue.constructFromObject(data['range']);
			}
			if (data.hasOwnProperty('active')) {
				obj['active'] = SearchRequestModelFilterRangeAllOfValue.constructFromObject(data['active']);
			}
		}
		return obj;
	}
}

/**
 * @member {Number} step
 */
SearchResponseModelFacetRange.prototype['step'] = undefined;

/**
 * @member {module:model/SearchRequestModelFilterRangeAllOfValue} range
 */
SearchResponseModelFacetRange.prototype['range'] = undefined;

/**
 * @member {module:model/SearchRequestModelFilterRangeAllOfValue} active
 */
SearchResponseModelFacetRange.prototype['active'] = undefined;

export default SearchResponseModelFacetRange;
