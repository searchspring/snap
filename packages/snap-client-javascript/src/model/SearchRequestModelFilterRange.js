/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelFilter from './SearchRequestModelFilter';
import SearchRequestModelFilterRangeAllOf from './SearchRequestModelFilterRangeAllOf';
import SearchRequestModelFilterRangeAllOfValue from './SearchRequestModelFilterRangeAllOfValue';

/**
 * The SearchRequestModelFilterRange model module.
 * @module model/SearchRequestModelFilterRange
 * @version 0.1.13
 */
class SearchRequestModelFilterRange {
	/**
	 * Constructs a new <code>SearchRequestModelFilterRange</code>.
	 * @alias module:model/SearchRequestModelFilterRange
	 * @extends module:model/SearchRequestModelFilter
	 * @implements module:model/SearchRequestModelFilter
	 * @implements module:model/SearchRequestModelFilterRangeAllOf
	 * @param type {module:model/SearchRequestModelFilterRange.TypeEnum}
	 */
	constructor(type) {
		SearchRequestModelFilter.initialize(this, type);
		SearchRequestModelFilterRangeAllOf.initialize(this);
		SearchRequestModelFilterRange.initialize(this, type);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, type) {}

	/**
	 * Constructs a <code>SearchRequestModelFilterRange</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModelFilterRange} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModelFilterRange} The populated <code>SearchRequestModelFilterRange</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModelFilterRange();

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
SearchRequestModelFilterRange.prototype['value'] = undefined;

export default SearchRequestModelFilterRange;
