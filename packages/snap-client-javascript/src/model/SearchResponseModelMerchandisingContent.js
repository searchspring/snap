/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
import SearchResponseModelMerchandisingContentInline from './SearchResponseModelMerchandisingContentInline';

/**
 * The SearchResponseModelMerchandisingContent model module.
 * @module model/SearchResponseModelMerchandisingContent
 * @version 0.1.13
 */
class SearchResponseModelMerchandisingContent {
	/**
	 * Constructs a new <code>SearchResponseModelMerchandisingContent</code>.
	 * @alias module:model/SearchResponseModelMerchandisingContent
	 */
	constructor() {
		SearchResponseModelMerchandisingContent.initialize(this);
	}

	/**
	 * Initializes the fields of this object.
	 * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
	 * Only for internal use.
	 */
	static initialize(obj) {}

	/**
	 * Constructs a <code>SearchResponseModelMerchandisingContent</code> from a plain JavaScript object, optionally creating a new instance.
	 * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
	 * @param {Object} data The plain JavaScript object bearing properties of interest.
	 * @param {module:model/SearchResponseModelMerchandisingContent} obj Optional instance to populate.
	 * @return {module:model/SearchResponseModelMerchandisingContent} The populated <code>SearchResponseModelMerchandisingContent</code> instance.
	 */
	static constructFromObject(data, obj) {
		if (data) {
			obj = obj || new SearchResponseModelMerchandisingContent();

			if (data.hasOwnProperty('header')) {
				obj['header'] = ApiClient.convertToType(data['header'], ['String']);
			}
			if (data.hasOwnProperty('banner')) {
				obj['banner'] = ApiClient.convertToType(data['banner'], ['String']);
			}
			if (data.hasOwnProperty('footer')) {
				obj['footer'] = ApiClient.convertToType(data['footer'], ['String']);
			}
			if (data.hasOwnProperty('left')) {
				obj['left'] = ApiClient.convertToType(data['left'], ['String']);
			}
			if (data.hasOwnProperty('inline')) {
				obj['inline'] = ApiClient.convertToType(data['inline'], [SearchResponseModelMerchandisingContentInline]);
			}
		}
		return obj;
	}
}

/**
 * @member {Array.<String>} header
 */
SearchResponseModelMerchandisingContent.prototype['header'] = undefined;

/**
 * @member {Array.<String>} banner
 */
SearchResponseModelMerchandisingContent.prototype['banner'] = undefined;

/**
 * @member {Array.<String>} footer
 */
SearchResponseModelMerchandisingContent.prototype['footer'] = undefined;

/**
 * @member {Array.<String>} left
 */
SearchResponseModelMerchandisingContent.prototype['left'] = undefined;

/**
 * @member {Array.<module:model/SearchResponseModelMerchandisingContentInline>} inline
 */
SearchResponseModelMerchandisingContent.prototype['inline'] = undefined;

export default SearchResponseModelMerchandisingContent;
