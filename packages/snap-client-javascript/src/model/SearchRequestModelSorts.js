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
 * The SearchRequestModelSorts model module.
 * @module model/SearchRequestModelSorts
 * @version 0.1.13
 */
class SearchRequestModelSorts {
	/**
	 * Constructs a new <code>SearchRequestModelSorts</code>.
	 * @alias module:model/SearchRequestModelSorts
	 */
	constructor() {
		SearchRequestModelSorts.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchRequestModelSorts</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchRequestModelSorts} obj Optional instance to populate.
	 * @return {module:model/SearchRequestModelSorts} The populated <code>SearchRequestModelSorts</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchRequestModelSorts();

			if (data.hasOwnProperty('field')) {
				obj['field'] = ApiClient.convertToType(data['field'], 'String');
			}
			if (data.hasOwnProperty('direction')) {
				obj['direction'] = ApiClient.convertToType(data['direction'], 'String');
			}
		}
		return obj;
	}
}

/**
 * Field to sort results by.
 * @member {String} field
 */
SearchRequestModelSorts.prototype['field'] = undefined;

/**
 * Direction to sort results by field (ascending / descending).
 * @member {module:model/SearchRequestModelSorts.DirectionEnum} direction
 */
SearchRequestModelSorts.prototype['direction'] = undefined;

/**
 * Allowed values for the <code>direction</code> property.
 * @enum {String}
 * @readonly
 */
SearchRequestModelSorts['DirectionEnum'] = {
	/**
	 * value: "asc"
	 * @const
	 */
	asc: 'asc',

	/**
	 * value: "desc"
	 * @const
	 */
	desc: 'desc',
};

export default SearchRequestModelSorts;
