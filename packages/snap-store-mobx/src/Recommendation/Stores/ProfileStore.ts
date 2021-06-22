import { observable, action, computed, makeObservable } from 'mobx';

export class ProfileStore {
	tag: string;
	placement: string;
	display = {};

	constructor(controller, profile) {
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
