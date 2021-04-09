/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelFilterRangeAllOf from './SearchRequestModelFilterRangeAllOf';
import SearchRequestModelFilterRangeAllOfValue from './SearchRequestModelFilterRangeAllOfValue';
import SearchResponseModelFilter from './SearchResponseModelFilter';

/**
 * The SearchResponseModelFilterRange model module.
 * @module model/SearchResponseModelFilterRange
 * @version 0.1.13
 */
class SearchResponseModelFilterRange {
	/**
	 * Constructs a new <code>SearchResponseModelFilterRange</code>.
	 * @alias module:model/SearchResponseModelFilterRange
	 * @extends module:model/SearchResponseModelFilter
	 * @implements module:model/SearchResponseModelFilter
	 * @implements module:model/SearchRequestModelFilterRangeAllOf
	 * @param type {module:model/SearchResponseModelFilterRange.TypeEnum}
	 */
	constructor(type) {
		SearchResponseModelFilter.initialize(this, type);
		SearchRequestModelFilterRangeAllOf.initialize(this);
		SearchResponseModelFilterRange.initialize(this, type);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, type) {}

	/**
	 * Constructs a <code>SearchResponseModelFilterRange</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFilterRange} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFilterRange} The populated <code>SearchResponseModelFilterRange</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFilterRange();

			if (data.hasOwnProperty('value')) {
				obj['value'] = SearchRequestModelFilterRangeAllOfValue.constructFromObject(data['value']);
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/SearchRequestModelFilterRangeAllOfValue} value
 */
SearchResponseModelFilterRange.prototype['value'] = undefined;

export default SearchResponseModelFilterRange;
