import { ProductClickEvent, BeaconPayload } from './types';

export class TrackEvent {
	intellisuggestData: string;
	intellisuggestSignature: string;
	href?: string;

	endpoint: string;
	src: string;
	img: HTMLImageElement;

	constructor(payload: BeaconPayload) {
		payload.event = payload.event as ProductClickEvent;

		if (!payload.context || !payload.event) {
			throw 'TrackEvent: object parameter required a valid `context` BeaconContext and `event` ProductClickEvent objects';
		}
		if (!payload.event?.intellisuggestData || !payload.event?.intellisuggestSignature) {
			throw 'TrackEvent: object parameter `event` ProductClickEvent object requires valid intellisuggestData and intellisuggestSignature values. These are the corresponding attributes in the Searchspring API response.';
		}

		this.intellisuggestData = payload.event.intellisuggestData;
		this.intellisuggestSignature = payload.event.intellisuggestSignature;
		this.href = payload.event?.href || '';

		this.endpoint = `https://${payload.context.website.trackingCode}.a.searchspring.io/api/track/track.json`;

		this.src =
			this.endpoint +
			`?d=${encodeURIComponent(this.intellisuggestData)}` +
			`&s=${encodeURIComponent(this.intellisuggestSignature)}` +
			`&u=${encodeURIComponent(this.href)}`;

		if (window.document.referrer) {
			this.src += `&r=${encodeURIComponent(window.document.referrer)}`;
		}

		this.img = new Image(1, 1);
		this.img.src = this.src; // setting src immediately invokes a request
	}
}
