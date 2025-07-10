import { observable, makeObservable } from 'mobx';

import type { RecommendCombinedResponseModel } from '@searchspring/snap-client';

import type { StoreServices } from '../../types';

export class RecommendationProfileStore {
	public tag!: string;
	public placement!: string;
	public display: Record<string, any> = {};
	public type? = 'default';

	constructor(services: StoreServices, data?: RecommendCombinedResponseModel) {
		if (!data?.profile?.tag) {
			return;
		}

		if (!data.profile.display.template) {
			throw new Error(`Recommendation Profile Store found a profile without a set template: ${data.profile.tag}`);
		}

		this.tag = data.profile.tag;
		this.placement = data.profile.placement;
		this.display = data.profile.display;
		this.type = data.profile.display.template.type;

		makeObservable(this, {
			tag: observable,
			placement: observable,
			display: observable,
			type: observable,
		});
	}
}
