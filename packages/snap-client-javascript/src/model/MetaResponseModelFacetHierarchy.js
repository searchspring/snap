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
import MetaResponseModelFacetHierarchyAllOf from './MetaResponseModelFacetHierarchyAllOf';
import MetaResponseModelFacetValue from './MetaResponseModelFacetValue';

/**
 * The MetaResponseModelFacetHierarchy model module.
 * @module model/MetaResponseModelFacetHierarchy
 * @version 0.1.13
 */
class MetaResponseModelFacetHierarchy {
	/**
	 * Constructs a new <code>MetaResponseModelFacetHierarchy</code>.
	 * @alias module:model/MetaResponseModelFacetHierarchy
	 * @extends module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacetDefaults
	 * @implements module:model/MetaResponseModelFacetValue
	 * @implements module:model/MetaResponseModelFacetHierarchyAllOf
	 */
	constructor() {
		MetaResponseModelFacet.initialize(this);
		MetaResponseModelFacetDefaults.initialize(this);
		MetaResponseModelFacetValue.initialize(this);
		MetaResponseModelFacetHierarchyAllOf.initialize(this);
		MetaResponseModelFacetHierarchy.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModelFacetHierarchy</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModelFacetHierarchy} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModelFacetHierarchy} The populated <code>MetaResponseModelFacetHierarchy</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModelFacetHierarchy();

			if (data.hasOwnProperty('label')) {
				obj['label'] = ApiClient.convertToType(data['label'], 'String');
			}
			if (data.hasOwnProperty('collapse')) {
				obj['collapse'] = ApiClient.convertToType(data['collapse'], 'Boolean');
			}
			if (data.hasOwnProperty('multiple')) {
				obj['multiple'] = ApiClient.convertToType(data['multiple'], 'String');
			}
			if (data.hasOwnProperty('hierarchyDelimiter')) {
				obj['hierarchyDelimiter'] = ApiClient.convertToType(data['hierarchyDelimiter'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {String} label
 */
MetaResponseModelFacetHierarchy.prototype['label'] = undefined;

/**
 * @member {Boolean} collapse
 */
MetaResponseModelFacetHierarchy.prototype['collapse'] = undefined;

/**
 * @member {module:model/MetaResponseModelFacetHierarchy.MultipleEnum} multiple
 */
MetaResponseModelFacetHierarchy.prototype['multiple'] = undefined;

/**
 * @member {String} hierarchyDelimiter
 */
MetaResponseModelFacetHierarchy.prototype['hierarchyDelimiter'] = undefined;

/**
 * Allowed values for the <code>multiple</code> property.
 * @enum {String}
 * @readonly
 */
MetaResponseModelFacetHierarchy['MultipleEnum'] = {
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

export default MetaResponseModelFacetHierarchy;
