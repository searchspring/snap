import { UrlManager } from '../../UrlManager/UrlManager';
import { UrlTranslator, UrlState } from '../../types';
import { reactLinker } from './react';

let url = '#{ "foo": "bar" }';

class MockTranslator implements UrlTranslator {
	getConfig() {
		return {};
	}

	getCurrentUrl() {
		return url;
	}

	serialize(state: UrlState): string {
		return '#' + JSON.stringify(state);
	}

	deserialize(url: string): UrlState {
		return JSON.parse(url.replace(/^#/, '') || '{}');
	}

	go(_url: string) {
		url = _url;
	}
}

describe('ReactLinker', () => {
	it('generates href and onClick', () => {
		const urlManager = new UrlManager(new MockTranslator());

		const linkObj = reactLinker(urlManager);

		expect(linkObj.href).toBe('#{"foo":"bar"}');
		expect(typeof linkObj.onClick).toBe('function');
	});
});
