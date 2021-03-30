/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */
import ApiClient from '../ApiClient';
/* import for discriminator */
import MetaResponseModelFacetGrid from './MetaResponseModelFacetGrid';
import MetaResponseModelFacetHierarchy from './MetaResponseModelFacetHierarchy';
import MetaResponseModelFacetList from './MetaResponseModelFacetList';
import MetaResponseModelFacetPalette from './MetaResponseModelFacetPalette';
import MetaResponseModelFacetSlider from './MetaResponseModelFacetSlider';


/**
 * The MetaResponseModelFacet model module.
 * @module model/MetaResponseModelFacet
 * @version 0.1.13
 */
class MetaResponseModelFacet {
    /**
     * Constructs a new <code>MetaResponseModelFacet</code>.
     * @alias module:model/MetaResponseModelFacet
     */
    constructor() { 
        
        MetaResponseModelFacet.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>MetaResponseModelFacet</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MetaResponseModelFacet} obj Optional instance to populate.
     * @return {module:model/MetaResponseModelFacet} The populated <code>MetaResponseModelFacet</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new MetaResponseModelFacet();

            if (data.hasOwnProperty('display')) {
                obj['display'] = ApiClient.convertToType(data['display'], 'String');
            }

            switch (obj['display']) {
                case 'grid':
                    MetaResponseModelFacetGrid.constructFromObject(data, obj);
                    break;
                case 'hierarchy':
                    MetaResponseModelFacetHierarchy.constructFromObject(data, obj);
                    break;
                case 'list':
                    MetaResponseModelFacetList.constructFromObject(data, obj);
                    break;
                case 'palette':
                    MetaResponseModelFacetPalette.constructFromObject(data, obj);
                    break;
                case 'slider':
                    MetaResponseModelFacetSlider.constructFromObject(data, obj);
                    break;
                default:
                    break;
            }
        }
        return obj;
    }


}

/**
 * @member {String} display
 */
MetaResponseModelFacet.prototype['display'] = undefined;





export default MetaResponseModelFacet;

