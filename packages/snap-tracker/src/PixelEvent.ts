import { featureFlags } from '@searchspring/snap-toolbox';
import {
	ProductViewEvent,
	TrackClickEvent,
	RecommendationsEvent,
	OrderTransactionEvent,
	BeaconPayload,
	CartViewEvent,
	BeaconCategory,
} from './types';

export class PixelEvent {
	endpoint: string;
	src: string;
	img: HTMLImageElement;
	event: ProductViewEvent | CartViewEvent[] | OrderTransactionEvent | RecommendationsEvent | TrackClickEvent | Record<string, never>;

	constructor(payload: BeaconPayload) {
		this.endpoint = `https://d3cgm8py10hi0z.cloudfront.net/is.gif`;

		this.src =
			this.endpoint +
			`?s=${encodeURIComponent(payload.context.website.trackingCode)}` +
			`&u=${encodeURIComponent(payload.context.userId)}` +
			`&ce=${featureFlags.cookies ? '1' : '0'}` +
			`&pt=${encodeURIComponent(document.title)}` +
			`&v=1` + // version always '1'? or set to snap package version?
			`&x=${Math.floor(Math.random() * 2147483647)}` +
			`${window.document.referrer ? `&r=${encodeURIComponent(window.document.referrer)}` : ''}`;

		this.event = payload.event;

		switch (payload.category) {
			case BeaconCategory.PAGEVIEW:
				this.event = this.event as ProductViewEvent;
				this.src += '&a=viewItem';
				if (this.event.sku) {
					this.src += `&sku=${encodeURIComponent(this.event.sku)}`;
				}
				break;
			case BeaconCategory.CARTVIEW:
				this.event = this.event as CartViewEvent[];
				this.src += '&a=basket';
				this.event.forEach((item) => {
					if (item.sku) {
						this.src += `&item=${encodeURIComponent(item.sku)};${encodeURIComponent(item?.qty || '')};${encodeURIComponent(item?.price || '')};`;
					}
				});
				break;
			case BeaconCategory.ORDERVIEW:
				this.event = this.event as OrderTransactionEvent;
				this.src += `&a=sale`;
				if (this.event?.orderId) this.src += `&orderId=${encodeURIComponent(this.event.orderId)}`;
				if (this.event?.total) this.src += `&total=${encodeURIComponent(this.event.total)}`;
				if (this.event?.city) this.src += `&city=${encodeURIComponent(this.event.city)}`;
				if (this.event?.state) this.src += `&state=${encodeURIComponent(this.event.state)}`;
				if (this.event?.country) this.src += `&country=${encodeURIComponent(this.event.country)}`;
				this.event.items.forEach((item) => {
					if (item.sku) {
						this.src += `&item=${encodeURIComponent(item.sku)};${encodeURIComponent(item?.qty || '')};${encodeURIComponent(item?.price || '')};`;
					}
				});
				break;
		}

		this.img = new Image(1, 1);
		this.img.src = this.src; // setting src immediately invokes a request
	}
}
