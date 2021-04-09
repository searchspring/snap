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

/**
 * The SearchResponseModelFacetRangeAllOf model module.
 * @module model/SearchResponseModelFacetRangeAllOf
 * @version 0.1.13
 */
class SearchResponseModelFacetRangeAllOf {
	/**
	 * Constructs a new <code>SearchResponseModelFacetRangeAllOf</code>.
	 * @alias module:model/SearchResponseModelFacetRangeAllOf
	 */
	constructor() {
		SearchResponseModelFacetRangeAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetRangeAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetRangeAllOf} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetRangeAllOf} The populated <code>SearchResponseModelFacetRangeAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetRangeAllOf();

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
SearchResponseModelFacetRangeAllOf.prototype['step'] = undefined;

/**
 * @member {module:model/SearchRequestModelFilterRangeAllOfValue} range
 */
SearchResponseModelFacetRangeAllOf.prototype['range'] = undefined;

/**
 * @member {module:model/SearchRequestModelFilterRangeAllOfValue} active
 */
SearchResponseModelFacetRangeAllOf.prototype['active'] = undefined;

export default SearchResponseModelFacetRangeAllOf;
