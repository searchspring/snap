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
 * The SearchResponseModelFacetValueAllOfValues model module.
 * @module model/SearchResponseModelFacetValueAllOfValues
 * @version 0.1.13
 */
class SearchResponseModelFacetValueAllOfValues {
	/**
	 * Constructs a new <code>SearchResponseModelFacetValueAllOfValues</code>.
	 * @alias module:model/SearchResponseModelFacetValueAllOfValues
	 */
	constructor() {
		SearchResponseModelFacetValueAllOfValues.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelFacetValueAllOfValues</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelFacetValueAllOfValues} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelFacetValueAllOfValues} The populated <code>SearchResponseModelFacetValueAllOfValues</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelFacetValueAllOfValues();

			if (data.hasOwnProperty('filtered')) {
				obj['filtered'] = ApiClient.convertToType(data['filtered'], 'Boolean');
			}
			if (data.hasOwnProperty('value')) {
				obj['value'] = ApiClient.convertToType(data['value'], 'String');
			}
			if (data.hasOwnProperty('label')) {
				obj['label'] = ApiClient.convertToType(data['label'], 'String');
			}
			if (data.hasOwnProperty('count')) {
				obj['count'] = ApiClient.convertToType(data['count'], 'Number');
			}
		}
		return obj;
	}
}

/**
 * @member {Boolean} filtered
 */
SearchResponseModelFacetValueAllOfValues.prototype['filtered'] = undefined;

/**
 * @member {String} value
 */
SearchResponseModelFacetValueAllOfValues.prototype['value'] = undefined;

/**
 * @member {String} label
 */
SearchResponseModelFacetValueAllOfValues.prototype['label'] = undefined;

/**
 * @member {Number} count
 */
SearchResponseModelFacetValueAllOfValues.prototype['count'] = undefined;

export default SearchResponseModelFacetValueAllOfValues;
