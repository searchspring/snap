import { observable, makeObservable } from 'mobx';
import type { StoreServices } from '../../types';

export class ProfileStore {
	tag: string;
	placement: string;
	display: Record<string, any> = {};

	constructor(services: StoreServices, profile) {
		if (!profile?.tag) {
			return;
		}

		this.tag = profile.tag;
		this.placement = profile.placement;
		this.display = profile.display;

		makeObservable(this, {
			tag: observable,
			placement: observable,
			display: observable,
		});
	}
}
