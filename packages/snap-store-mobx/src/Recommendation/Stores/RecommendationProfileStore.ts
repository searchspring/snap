import { observable, makeObservable } from 'mobx';
import type { ProfileResponseModel } from '@searchspring/snap-client';

type RecommendationProfileStoreConfig = {
	data: {
		profile: ProfileResponseModel;
	};
};
export class RecommendationProfileStore {
	public tag!: string;
	public placement!: string;
	public display: Record<string, any> = {};
	public type? = 'default';

	constructor(params: RecommendationProfileStoreConfig) {
		const { data } = params || {};
		const { profile } = data?.profile || {};

		if (!profile?.tag) {
			return;
		}

		if (!profile.display.template) {
			throw new Error(`Recommendation Profile Store found a profile without a set template: ${profile.tag}`);
		}

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
