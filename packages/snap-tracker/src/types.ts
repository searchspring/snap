import { AppMode } from '@searchspring/snap-toolbox';
import type { BeaconConfig, Currency, Product } from '@searchspring/beacon';

export type TrackerGlobals = {
	siteId: string;
	currency?: Currency;
	cart?: Product[];
};

export type TrackerEvents = 'error' | 'shopper.login' | 'product.view' | 'product.click' | 'cart.view' | 'order.transaction';

export type TrackerConfig = BeaconConfig & {
	id?: string;
	framework?: string;
	mode?: keyof typeof AppMode | AppMode;
	doNotTrack?: TrackerEvents[];
};

export interface ShopperLoginEvent {
	id: string;
}
export interface TrackErrorEvent {
	href?: string;
	filename?: string;
	stack?: string;
	message?: string;
	colno?: number;
	lineno?: number;
	errortimestamp?: number;
	context?: {
		controller?: {
			type: string;
			id: string;
		};
	};
	details?: { [any: string]: unknown };
}
export interface ProductViewEvent {
	uid?: string;
	parentId?: string;
	sku?: string;
	childUid?: string; // legacy support
	childSku?: string; // legacy support
}

export interface ProductData extends ProductViewEvent {
	qty: string | number;
	price: string | number;
}

export interface OrderTransactionData {
	order?: {
		id?: string | number;
		total?: string | number;
		transactionTotal?: string | number;
		city?: string;
		state?: string;
		country?: string;
	};
	items: ProductData[];
}

export interface TrackMethods {
	error: (data: TrackErrorEvent) => undefined;
	shopper: {
		login: (data: ShopperLoginEvent, siteId?: string) => undefined;
	};
	product: {
		view: (data: ProductViewEvent, siteId?: string) => undefined;
		click: () => void;
	};
	cart: {
		view: () => void;
	};
	order: {
		transaction: (data: OrderTransactionData, siteId?: string) => undefined;
	};
}

declare global {
	interface Window {
		searchspring?: any;
	}
}
