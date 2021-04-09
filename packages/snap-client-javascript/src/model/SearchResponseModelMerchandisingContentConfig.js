/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelMerchandisingContentConfigPosition from './SearchResponseModelMerchandisingContentConfigPosition';

/**
 * The SearchResponseModelMerchandisingContentConfig model module.
 * @module model/SearchResponseModelMerchandisingContentConfig
 * @version 0.1.13
 */
class SearchResponseModelMerchandisingContentConfig {
	/**
	 * Constructs a new <code>SearchResponseModelMerchandisingContentConfig</code>.
	 * @alias module:model/SearchResponseModelMerchandisingContentConfig
	 */
	constructor() {
		SearchResponseModelMerchandisingContentConfig.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelMerchandisingContentConfig</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelMerchandisingContentConfig} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelMerchandisingContentConfig} The populated <code>SearchResponseModelMerchandisingContentConfig</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelMerchandisingContentConfig();

			if (data.hasOwnProperty('position')) {
				obj['position'] = SearchResponseModelMerchandisingContentConfigPosition.constructFromObject(data['position']);
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/SearchResponseModelMerchandisingContentConfigPosition} position
 */
SearchResponseModelMerchandisingContentConfig.prototype['position'] = undefined;

export default SearchResponseModelMerchandisingContentConfig;
