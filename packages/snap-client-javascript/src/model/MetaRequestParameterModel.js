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
 * The MetaRequestParameterModel model module.
 * @module model/MetaRequestParameterModel
 * @version 0.1.13
 */
class MetaRequestParameterModel {
	/**
	 * Constructs a new <code>MetaRequestParameterModel</code>.
	 * @alias module:model/MetaRequestParameterModel
	 * @param siteId {String} siteId of account
	 */
	constructor(siteId) {
		MetaRequestParameterModel.initialize(this, siteId);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj, siteId) {
		obj['siteId'] = siteId;
	}

	/**
	 * Constructs a <code>MetaRequestParameterModel</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/MetaRequestParameterModel} obj Optional instance to populate.
	 * @return {module:model/MetaRequestParameterModel} The populated <code>MetaRequestParameterModel</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new MetaRequestParameterModel();

			if (data.hasOwnProperty('siteId')) {
				obj['siteId'] = ApiClient.convertToType(data['siteId'], 'String');
			}
		}
		return obj;
	}
}

/**
 * siteId of account
 * @member {String} siteId
 */
MetaRequestParameterModel.prototype['siteId'] = undefined;

export default MetaRequestParameterModel;
