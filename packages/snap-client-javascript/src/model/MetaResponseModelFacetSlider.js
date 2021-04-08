/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import MetaResponseModelFacet from './MetaResponseModelFacet';
import MetaResponseModelFacetDefaults from './MetaResponseModelFacetDefaults';
import MetaResponseModelFacetSliderAllOf from './MetaResponseModelFacetSliderAllOf';

/**
 * The MetaResponseModelFacetSlider model module.
 * @module model/MetaResponseModelFacetSlider
 * @version 0.1.13
 */
class MetaResponseModelFacetSlider {
	/**
	 * Constructs a new <code>MetaResponseModelFacetSlider</code>.
	 * @alias module:model/MetaResponseModelFacetSlider
	 * @extends module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacetDefaults
	 * @implements module:model/MetaResponseModelFacetSliderAllOf
	 */
	constructor() {
		MetaResponseModelFacet.initialize(this);
		MetaResponseModelFacetDefaults.initialize(this);
		MetaResponseModelFacetSliderAllOf.initialize(this);
		MetaResponseModelFacetSlider.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModelFacetSlider</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModelFacetSlider} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModelFacetSlider} The populated <code>MetaResponseModelFacetSlider</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModelFacetSlider();

			if (data.hasOwnProperty('label')) {
				obj['label'] = ApiClient.convertToType(data['label'], 'String');
			}
			if (data.hasOwnProperty('collapse')) {
				obj['collapse'] = ApiClient.convertToType(data['collapse'], 'Boolean');
			}
			if (data.hasOwnProperty('formatSeparator')) {
				obj['formatSeparator'] = ApiClient.convertToType(data['formatSeparator'], 'String');
			}
			if (data.hasOwnProperty('formatValue')) {
				obj['formatValue'] = ApiClient.convertToType(data['formatValue'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} label
 */
MetaResponseModelFacetSlider.prototype['label'] = undefined;

/**
 * @member {Boolean} collapse
 */
MetaResponseModelFacetSlider.prototype['collapse'] = undefined;

/**
 * @member {String} formatSeparator
 */
MetaResponseModelFacetSlider.prototype['formatSeparator'] = undefined;

/**
 * @member {String} formatValue
 */
MetaResponseModelFacetSlider.prototype['formatValue'] = undefined;

export default MetaResponseModelFacetSlider;
