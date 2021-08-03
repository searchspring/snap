import { observable, makeObservable } from 'mobx';

enum ContentType {
	HEADER = 'header',
	BANNER = 'banner',
	FOOTER = 'footer',
	LEFT = 'left',
	INLINE = 'inline',
}
export class MerchandisingStore {
	redirect = '';
	content: Partial<Record<ContentType, Content[]>> = {};

	constructor(services, merchData) {
		if (merchData) {
			this.redirect = merchData.redirect || '';

			if (merchData.content) {
				Object.values(ContentType).forEach((type) => {
					if (merchData.content[type]) {
						this.content[type] = new Content(merchData.content[type]);
					}
				});
			}
		}
	}
}

class Content extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(content) {
		super(...content);
	}
}
