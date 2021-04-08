/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';

/**
 * The SearchRequestModelFilterValueAllOf model module.
 * @module model/SearchRequestModelFilterValueAllOf
 * @version 0.1.13
 */
class SearchRequestModelFilterValueAllOf {
	/**
	 * Constructs a new <code>SearchRequestModelFilterValueAllOf</code>.
	 * @alias module:model/SearchRequestModelFilterValueAllOf
	 */
	constructor() {
		SearchRequestModelFilterValueAllOf.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchRequestModelFilterValueAllOf</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModelFilterValueAllOf} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModelFilterValueAllOf} The populated <code>SearchRequestModelFilterValueAllOf</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModelFilterValueAllOf();

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
SearchRequestModelFilterValueAllOf.prototype['value'] = undefined;

export default SearchRequestModelFilterValueAllOf;
