import { observable, makeObservable } from 'mobx';

import type { StoreServices } from '../../types';
import type {
	SearchResponseModelMerchandising,
	SearchResponseModelMerchandisingContentInline,
	SearchResponseModelMerchandisingCampaigns,
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
	public content: BannerContent = {};
	public campaigns: SearchResponseModelMerchandisingCampaigns[] = [];
	public landingPage?: SearchResponseModelMerchandisingCampaigns;
	public personalized?: boolean;

	constructor(services: StoreServices, merchData: SearchResponseModelMerchandising) {
		if (merchData) {
			this.redirect = merchData.redirect || '';

			if (merchData.content) {
				Object.values(ContentType).forEach((type) => {
					if (merchData.content && merchData.content[type]) {
						this.content[type] = new Content(merchData.content[type]!);
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

			if (merchData.personalized) this.personalized = merchData.personalized;
		}
	}
}

class Content extends Array<string | SearchResponseModelMerchandisingContentInline> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(content: string[] | SearchResponseModelMerchandisingContentInline[]) {
		super(...content);
	}
}
