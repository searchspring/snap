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
import MetaResponseModelSortOption from './MetaResponseModelSortOption';

/**
 * The MetaResponseModel model module.
 * @module model/MetaResponseModel
 * @version 0.1.13
 */
class MetaResponseModel {
	/**
	 * Constructs a new <code>MetaResponseModel</code>.
	 * @alias module:model/MetaResponseModel
	 */
	constructor() {
		MetaResponseModel.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>MetaResponseModel</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaResponseModel} obj Optional instance to populate.
	 * @return {module:model/MetaResponseModel} The populated <code>MetaResponseModel</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaResponseModel();

			if (data.hasOwnProperty('sortOptions')) {
				obj['sortOptions'] = ApiClient.convertToType(data['sortOptions'], [MetaResponseModelSortOption]);
			}
			if (data.hasOwnProperty('facets')) {
				obj['facets'] = ApiClient.convertToType(data['facets'], { String: MetaResponseModelFacet });
			}
		}
		return obj;
	}
}

/**
 * @member {Array.<module:model/MetaResponseModelSortOption>} sortOptions
 */
MetaResponseModel.prototype['sortOptions'] = undefined;

/**
 * @member {Object.<String, module:model/MetaResponseModelFacet>} facets
 */
MetaResponseModel.prototype['facets'] = undefined;

export default MetaResponseModel;
