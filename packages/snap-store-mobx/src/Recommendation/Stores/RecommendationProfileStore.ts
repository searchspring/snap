import { observable, makeObservable } from 'mobx';

import { ProfilePlacement } from '@searchspring/snap-tracker';
import type { RecommendCombinedResponseModel } from '@searchspring/snap-client';

import type { StoreServices } from '../../types';

export class RecommendationProfileStore {
	public tag!: string;
	public placement!: ProfilePlacement;
	public display: Record<string, any> = {};

	constructor(services: StoreServices, data?: RecommendCombinedResponseModel) {
		if (!data?.profile?.tag) {
			return;
		}

		this.tag = data.profile.tag;
		this.placement = data.profile.placement as ProfilePlacement;
		this.display = data.profile.display;

		makeObservable(this, {
			tag: observable,
			placement: observable,
			display: observable,
		});
	}
}
