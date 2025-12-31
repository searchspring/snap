import type { StoreServices } from '../../types';
import type {
	SearchResponseModelMerchandising,
	SearchResponseModelMerchandisingCampaigns,
	SearchResponseModelMerchandisingExperiments,
	SearchResponseModelTracking,
} from '@searchspring/snapi-types';

export enum ContentType {
	HEADER = 'header',
	BANNER = 'banner',
	FOOTER = 'footer',
	LEFT = 'left',
	INLINE = 'inline',
}

export type BannerContent = Partial<Record<ContentType, Content>>;

export class SearchMerchandisingStore {
	public redirect = '';
	public responseId = '';
	public content: BannerContent = {};
	public campaigns: SearchResponseModelMerchandisingCampaigns[] = [];
	public landingPage?: SearchResponseModelMerchandisingCampaigns;
	public personalized?: boolean = false;
	public experiments: SearchResponseModelMerchandisingExperiments[] = [];

	constructor(services: StoreServices, merchData: SearchResponseModelMerchandising, tracking: SearchResponseModelTracking) {
		if (merchData) {
			this.redirect = merchData.redirect || '';
			this.responseId = tracking?.responseId || ''; // Autocomplete 'beforeSubmit' doesn't have a response reference

			if (merchData.content) {
				Object.values(ContentType).forEach((type) => {
					if (merchData.content && merchData.content[type]) {
						// Extract data-banner-id from the HTML string
						const htmlString = merchData.content[type]?.[0] || '';
						const match = typeof htmlString === 'string' && htmlString.match(/data-banner-id="(\d+)"/);
						const uid = match ? match[1] : '';

						this.content[type] = new Content([
							{
								value: merchData.content[type]!,
								uid,
								responseId: this.responseId,
							},
						] as MerchandisingContentBanner[]);
					}
				});
			}
			if (merchData.campaigns) {
				this.campaigns = merchData.campaigns;
				// if we find a 'landing-page', get landingPage details from merchandising.campaigns
				merchData.campaigns.forEach((campaign) => {
					if (campaign.type == 'landing-page') {
						this.landingPage = campaign;
					}
				});
			}

			if (merchData.experiments) {
				this.experiments = merchData.experiments;
			}

			this.personalized = !!merchData.personalized;
		}
	}
}

export type MerchandisingContentBanner = {
	value: string[];
	uid: string;
	responseId: string;
};
class Content extends Array<MerchandisingContentBanner> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(content: MerchandisingContentBanner[]) {
		super(...content);
	}
}
