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
 * The MetaResponseModelFacetList model module.
 * @module model/MetaResponseModelFacetList
 * @version 0.1.13
 */
class MetaResponseModelFacetList {
	/**
	 * Constructs a new <code>MetaResponseModelFacetList</code>.
	 * @alias module:model/MetaResponseModelFacetList
	 * @extends module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacet
	 * @implements module:model/MetaResponseModelFacetDefaults
	 * @implements module:model/MetaResponseModelFacetValue
	 */
	constructor() {
		MetaResponseModelFacet.initialize(this);
		MetaResponseModelFacetDefaults.initialize(this);
		MetaResponseModelFacetValue.initialize(this);
		MetaResponseModelFacetList.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModelFacetList</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModelFacetList} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModelFacetList} The populated <code>MetaResponseModelFacetList</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModelFacetList();

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
MetaResponseModelFacetList.prototype['label'] = undefined;

/**
 * @member {Boolean} collapse
 */
MetaResponseModelFacetList.prototype['collapse'] = undefined;

/**
 * @member {module:model/MetaResponseModelFacetList.MultipleEnum} multiple
 */
MetaResponseModelFacetList.prototype['multiple'] = undefined;

/**
 * Allowed values for the <code>multiple</code> property.
 * @enum {String}
 * @readonly
 */
MetaResponseModelFacetList['MultipleEnum'] = {
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

export default MetaResponseModelFacetList;
