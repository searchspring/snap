/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelFacet from './SearchResponseModelFacet';
import SearchResponseModelFacetValueAllOf from './SearchResponseModelFacetValueAllOf';
import SearchResponseModelFacetValueAllOfValues from './SearchResponseModelFacetValueAllOfValues';

/**
 * The SearchResponseModelFacetValue model module.
 * @module model/SearchResponseModelFacetValue
 * @version 0.1.13
 */
class SearchResponseModelFacetValue {
	/**
	 * Constructs a new <code>SearchResponseModelFacetValue</code>.
	 * @alias module:model/SearchResponseModelFacetValue
	 * @extends module:model/SearchResponseModelFacet
	 * @implements module:model/SearchResponseModelFacet
	 * @implements module:model/SearchResponseModelFacetValueAllOf
	 * @param type {String}
	 */
	constructor(type) {
		SearchResponseModelFacet.initialize(this, type);
		SearchResponseModelFacetValueAllOf.initialize(this);
		SearchResponseModelFacetValue.initialize(this, type);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, type) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetValue</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetValue} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetValue} The populated <code>SearchResponseModelFacetValue</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetValue();

			if (data.hasOwnProperty('values')) {
				obj['values'] = ApiClient.convertToType(data['values'], [SearchResponseModelFacetValueAllOfValues]);
			}
		}
		return obj;
	}
}

/**
 * @member {Array.<module:model/SearchResponseModelFacetValueAllOfValues>} values
 */
SearchResponseModelFacetValue.prototype['values'] = undefined;

export default SearchResponseModelFacetValue;
