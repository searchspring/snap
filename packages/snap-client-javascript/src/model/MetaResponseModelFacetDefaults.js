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
 * The MetaResponseModelFacetDefaults model module.
 * @module model/MetaResponseModelFacetDefaults
 * @version 0.1.13
 */
class MetaResponseModelFacetDefaults {
	/**
	 * Constructs a new <code>MetaResponseModelFacetDefaults</code>.
	 * @alias module:model/MetaResponseModelFacetDefaults
	 */
	constructor() {
		MetaResponseModelFacetDefaults.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModelFacetDefaults</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModelFacetDefaults} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModelFacetDefaults} The populated <code>MetaResponseModelFacetDefaults</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModelFacetDefaults();

			if (data.hasOwnProperty('label')) {
				obj['label'] = ApiClient.convertToType(data['label'], 'String');
			}
			if (data.hasOwnProperty('collapse')) {
				obj['collapse'] = ApiClient.convertToType(data['collapse'], 'Boolean');
			}
		}
		return obj;
	}
}

/**
 * @member {String} label
 */
MetaResponseModelFacetDefaults.prototype['label'] = undefined;

/**
 * @member {Boolean} collapse
 */
MetaResponseModelFacetDefaults.prototype['collapse'] = undefined;

export default MetaResponseModelFacetDefaults;
