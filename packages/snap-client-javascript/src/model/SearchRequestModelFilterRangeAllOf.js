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
 * The SearchRequestModelFilterRangeAllOf model module.
 * @module model/SearchRequestModelFilterRangeAllOf
 * @version 0.1.13
 */
class SearchRequestModelFilterRangeAllOf {
	/**
	 * Constructs a new <code>SearchRequestModelFilterRangeAllOf</code>.
	 * @alias module:model/SearchRequestModelFilterRangeAllOf
	 */
	constructor() {
		SearchRequestModelFilterRangeAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchRequestModelFilterRangeAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModelFilterRangeAllOf} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModelFilterRangeAllOf} The populated <code>SearchRequestModelFilterRangeAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModelFilterRangeAllOf();

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
SearchRequestModelFilterRangeAllOf.prototype['value'] = undefined;

export default SearchRequestModelFilterRangeAllOf;
