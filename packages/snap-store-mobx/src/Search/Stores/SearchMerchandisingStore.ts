import type {
	SearchResponseModelMerchandisingContentInline,
	SearchResponseModelMerchandisingCampaigns,
	SearchResponseModel,
} from '@searchspring/snapi-types';

export enum ContentType {
	HEADER = 'header',
	BANNER = 'banner',
	FOOTER = 'footer',
	LEFT = 'left',
	INLINE = 'inline',
}

export type BannerContent = Partial<Record<ContentType, Content>>;

type SearchMerchandisingStoreConfig = {
	data: {
		search: SearchResponseModel;
	};
};

export class SearchMerchandisingStore {
	public redirect = '';
	public content: BannerContent = {};
	public campaigns: SearchResponseModelMerchandisingCampaigns[] = [];
	public landingPage?: SearchResponseModelMerchandisingCampaigns;
	public personalized?: boolean;

	constructor(params: SearchMerchandisingStoreConfig) {
		const { merchandising } = params.data.search;
		if (merchandising) {
			this.redirect = merchandising.redirect || '';

			if (merchandising.content) {
				Object.values(ContentType).forEach((type) => {
					if (merchandising.content && merchandising.content[type]) {
						this.content[type] = new Content(merchandising.content[type]!);
					}
				});
			}
			if (merchandising.campaigns) {
				this.campaigns = merchandising.campaigns;
				// if we find a 'landing-page', get landingPage details from merchandising.campaigns
				merchandising.campaigns.forEach((campaign) => {
					if (campaign.type == 'landing-page') {
						this.landingPage = campaign;
					}
				});
			}

			if (merchandising.personalized) this.personalized = merchandising.personalized;
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
