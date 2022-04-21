import { featureFlags } from '@searchspring/snap-toolbox';
import { ProductViewEvent, OrderTransactionEvent, BeaconPayload, CartViewEvent, BeaconCategory } from './types';

export class PixelEvent {
	endpoint: string;
	src: string;
	img: HTMLImageElement | undefined;
	event: ProductViewEvent | CartViewEvent | OrderTransactionEvent | undefined;

	constructor(payload: BeaconPayload) {
		this.endpoint = `https://d3cgm8py10hi0z.cloudfront.net/is.gif`;

		this.src =
			this.endpoint +
			`?s=${encodeURIComponent(payload?.context?.website?.trackingCode || '')}` +
			`&u=${encodeURIComponent(payload?.context?.userId || '')}` +
			`&ce=${featureFlags.cookies ? '1' : '0'}` +
			`&pt=${encodeURIComponent(document.title)}` +
			`&v=1` + // version always '1'? or set to snap package version?
			`&x=${Math.floor(Math.random() * 2147483647)}` +
			`${window.document.referrer ? `&r=${encodeURIComponent(window.document.referrer)}` : ''}`;

		switch (payload.category) {
			case BeaconCategory.PAGEVIEW:
				this.event = payload.event as ProductViewEvent;
				this.src += '&a=viewItem';
				if (this.event.sku) {
					this.src += `&sku=${encodeURIComponent(this.event.sku)}`;
				}
				break;
			case BeaconCategory.CARTVIEW:
				this.event = payload.event as CartViewEvent;
				this.src += '&a=basket';
				this.event.items.forEach((item) => {
					if (item?.sku) {
						this.src += `&item=${encodeURIComponent(item.sku)};${encodeURIComponent(item?.qty || '')};${encodeURIComponent(item?.price || '')};`;
					}
				});
				break;
			case BeaconCategory.ORDERVIEW:
				const { orderId, total, city, state, country, items } = (this.event = payload.event as OrderTransactionEvent);
				this.src += `&a=sale`;
				if (orderId) this.src += `&orderId=${encodeURIComponent(orderId)}`;
				if (total) this.src += `&total=${encodeURIComponent(total)}`;
				if (city) this.src += `&city=${encodeURIComponent(city)}`;
				if (state) this.src += `&state=${encodeURIComponent(state)}`;
				if (country) this.src += `&country=${encodeURIComponent(country)}`;
				items.forEach((item) => {
					if (item?.sku) {
						this.src += `&item=${encodeURIComponent(item.sku)};${encodeURIComponent(item?.qty || '')};${encodeURIComponent(item?.price || '')};`;
					}
				});
				break;
		}
		if (this.src.includes('&a=')) {
			this.img = new Image(1, 1);
			this.img.src = this.src; // setting src immediately invokes a request
		}
	}
}
