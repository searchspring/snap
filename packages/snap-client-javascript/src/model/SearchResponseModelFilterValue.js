/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchRequestModelFilterValueAllOf from './SearchRequestModelFilterValueAllOf';
import SearchResponseModelFilter from './SearchResponseModelFilter';

/**
 * The SearchResponseModelFilterValue model module.
 * @module model/SearchResponseModelFilterValue
 * @version 0.1.13
 */
class SearchResponseModelFilterValue {
	/**
	 * Constructs a new <code>SearchResponseModelFilterValue</code>.
	 * @alias module:model/SearchResponseModelFilterValue
	 * @extends module:model/SearchResponseModelFilter
	 * @implements module:model/SearchResponseModelFilter
	 * @implements module:model/SearchRequestModelFilterValueAllOf
	 * @param type {module:model/SearchResponseModelFilterValue.TypeEnum}
	 */
	constructor(type) {
		SearchResponseModelFilter.initialize(this, type);
		SearchRequestModelFilterValueAllOf.initialize(this);
		SearchResponseModelFilterValue.initialize(this, type);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, type) {}

	/**
	 * Constructs a <code>SearchResponseModelFilterValue</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFilterValue} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFilterValue} The populated <code>SearchResponseModelFilterValue</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFilterValue();

			if (data.hasOwnProperty('value')) {
				obj['value'] = ApiClient.convertToType(data['value'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} value
 */
SearchResponseModelFilterValue.prototype['value'] = undefined;

export default SearchResponseModelFilterValue;
