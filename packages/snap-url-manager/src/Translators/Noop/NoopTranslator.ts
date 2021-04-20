import { UrlState, Translator } from '../../types';

export class NoopTranslator implements Translator {
	private url = '{}';

	getCurrentUrl(): string {
		return this.url;
	}

	getConfig(): Record<string, unknown> {
		return {};
	}

	serialize(state: UrlState): string {
		return JSON.stringify(state);
	}

	deserialize(url: string): UrlState {
		return JSON.parse(url);
	}

	go(url: string): void {
		this.url = url;
	}
}
