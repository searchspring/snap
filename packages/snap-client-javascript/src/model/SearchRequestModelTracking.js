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
 * The SearchRequestModelTracking model module.
 * @module model/SearchRequestModelTracking
 * @version 0.1.13
 */
class SearchRequestModelTracking {
	/**
	 * Constructs a new <code>SearchRequestModelTracking</code>.
	 * @alias module:model/SearchRequestModelTracking
	 */
	constructor() {
		SearchRequestModelTracking.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchRequestModelTracking</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModelTracking} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModelTracking} The populated <code>SearchRequestModelTracking</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModelTracking();

			if (data.hasOwnProperty('loggedInUserId')) {
				obj['loggedInUserId'] = ApiClient.convertToType(data['loggedInUserId'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} loggedInUserId
 */
SearchRequestModelTracking.prototype['loggedInUserId'] = undefined;

export default SearchRequestModelTracking;
