import { observable, makeObservable } from 'mobx';

import type { StoreServices } from '../../types';
import type { SearchResponseModelMerchandising, SearchResponseModelMerchandisingContentInline } from '@searchspring/snapi-types';

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
	public campaigns: {
		id?: string;
		title?: string;
		type?: string;
	}[] = [];

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
			}
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
