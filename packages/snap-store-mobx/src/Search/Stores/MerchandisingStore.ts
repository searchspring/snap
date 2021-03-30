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
	content: {
		[ContentType.HEADER]?: Content;
	} = {};

	constructor(controller, merchData) {
		if (controller && merchData) {
			this.redirect = merchData.redirect || '';

			if (merchData.content) {
				Object.values(ContentType).forEach((type) => {
					if (merchData.content[type]) {
						this.content[type] = new Content(controller, merchData.content[type]);
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

	constructor(controller, content) {
		super(...content);
	}
}
