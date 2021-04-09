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
 * The MetaResponseModelSortOption model module.
 * @module model/MetaResponseModelSortOption
 * @version 0.1.13
 */
class MetaResponseModelSortOption {
	/**
	 * Constructs a new <code>MetaResponseModelSortOption</code>.
	 * @alias module:model/MetaResponseModelSortOption
	 */
	constructor() {
		MetaResponseModelSortOption.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModelSortOption</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModelSortOption} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModelSortOption} The populated <code>MetaResponseModelSortOption</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModelSortOption();

			if (data.hasOwnProperty('type')) {
				obj['type'] = ApiClient.convertToType(data['type'], 'String');
			}
			if (data.hasOwnProperty('field')) {
				obj['field'] = ApiClient.convertToType(data['field'], 'String');
			}
			if (data.hasOwnProperty('direction')) {
				obj['direction'] = ApiClient.convertToType(data['direction'], 'String');
			}
			if (data.hasOwnProperty('label')) {
				obj['label'] = ApiClient.convertToType(data['label'], 'String');
			}
		}
		return obj;
	}
}

/**
 * @member {module:model/MetaResponseModelSortOption.TypeEnum} type
 */
MetaResponseModelSortOption.prototype['type'] = undefined;

/**
 * @member {String} field
 */
MetaResponseModelSortOption.prototype['field'] = undefined;

/**
 * @member {module:model/MetaResponseModelSortOption.DirectionEnum} direction
 */
MetaResponseModelSortOption.prototype['direction'] = undefined;

/**
 * @member {String} label
 */
MetaResponseModelSortOption.prototype['label'] = undefined;

/**
 * Allowed values for the <code>type</code> property.
 * @enum {String}
 * @readonly
 */
MetaResponseModelSortOption['TypeEnum'] = {
	/**
	 * value: "field"
	 * @const
	 */
	field: 'field',

	/**
	 * value: "relevance"
	 * @const
	 */
	relevance: 'relevance',
};

/**
 * Allowed values for the <code>direction</code> property.
 * @enum {String}
 * @readonly
 */
MetaResponseModelSortOption['DirectionEnum'] = {
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

export default MetaResponseModelSortOption;
