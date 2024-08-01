import { observable, makeObservable } from 'mobx';

import type { RecommendCombinedResponseModel } from '@searchspring/snap-client';

type RecommendationProfileStoreConfig = {
	data: {
		recommend: RecommendCombinedResponseModel;
	};
};
export class RecommendationProfileStore {
	public tag!: string;
	public placement!: string;
	public display: Record<string, any> = {};
	public type? = 'default';

	constructor(params: RecommendationProfileStoreConfig) {
		const { data } = params;
		const { recommend } = data;

		if (!recommend?.profile?.tag) {
			return;
		}
		const { profile } = recommend;

		this.tag = profile.tag;
		this.placement = profile.placement;
		this.display = profile.display;
		this.type = profile.display.template.type;

		makeObservable(this, {
			tag: observable,
			placement: observable,
			display: observable,
			type: observable,
		});
	}
}
