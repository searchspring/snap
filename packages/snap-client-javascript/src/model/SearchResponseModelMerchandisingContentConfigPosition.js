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
 * The SearchResponseModelMerchandisingContentConfigPosition model module.
 * @module model/SearchResponseModelMerchandisingContentConfigPosition
 * @version 0.1.13
 */
class SearchResponseModelMerchandisingContentConfigPosition {
	/**
	 * Constructs a new <code>SearchResponseModelMerchandisingContentConfigPosition</code>.
	 * @alias module:model/SearchResponseModelMerchandisingContentConfigPosition
	 */
	constructor() {
		SearchResponseModelMerchandisingContentConfigPosition.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelMerchandisingContentConfigPosition</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelMerchandisingContentConfigPosition} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelMerchandisingContentConfigPosition} The populated <code>SearchResponseModelMerchandisingContentConfigPosition</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelMerchandisingContentConfigPosition();

			if (data.hasOwnProperty('index')) {
				obj['index'] = ApiClient.convertToType(data['index'], 'Number');
			}
		}
		return obj;
	}
}

/**
 * @member {Number} index
 */
SearchResponseModelMerchandisingContentConfigPosition.prototype['index'] = undefined;

export default SearchResponseModelMerchandisingContentConfigPosition;
