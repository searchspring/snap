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
import MetaResponseModelFacetValue from './MetaResponseModelFacetValue';

/**
 * The MetaResponseModelFacetGrid model module.
 * @module model/MetaResponseModelFacetGrid
 * @version 0.1.13
 */
class MetaResponseModelFacetGrid {
	/**
	 * Constructs a new <code>MetaResponseModelFacetGrid</code>.
	 * @alias module:model/MetaResponseModelFacetGrid
	 * @extends module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacetDefaults
	 * @implements module:model/MetaResponseModelFacetValue
	 */
	constructor() {
		MetaResponseModelFacet.initialize(this);
		MetaResponseModelFacetDefaults.initialize(this);
		MetaResponseModelFacetValue.initialize(this);
		MetaResponseModelFacetGrid.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModelFacetGrid</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModelFacetGrid} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModelFacetGrid} The populated <code>MetaResponseModelFacetGrid</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModelFacetGrid();

			if (data.hasOwnProperty('label')) {
				obj['label'] = ApiClient.convertToType(data['label'], 'String');
			}
			if (data.hasOwnProperty('collapse')) {
				obj['collapse'] = ApiClient.convertToType(data['collapse'], 'Boolean');
			}
			if (data.hasOwnProperty('multiple')) {
				obj['multiple'] = ApiClient.convertToType(data['multiple'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} label
 */
MetaResponseModelFacetGrid.prototype['label'] = undefined;

/**
 * @member {Boolean} collapse
 */
MetaResponseModelFacetGrid.prototype['collapse'] = undefined;

/**
 * @member {module:model/MetaResponseModelFacetGrid.MultipleEnum} multiple
 */
MetaResponseModelFacetGrid.prototype['multiple'] = undefined;

/**
 * Allowed values for the <code>multiple</code> property.
 * @enum {String}
 * @readonly
 */
MetaResponseModelFacetGrid['MultipleEnum'] = {
	/**
	 * value: "single"
	 * @const
	 */
	single: 'single',

	/**
	 * value: "or"
	 * @const
	 */
	or: 'or',

	/**
	 * value: "and"
	 * @const
	 */
	and: 'and',
};

export default MetaResponseModelFacetGrid;
