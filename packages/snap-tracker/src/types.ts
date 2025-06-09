import { AppMode } from '@searchspring/snap-toolbox';
import type { ContextCurrency, Product } from '@searchspring/beacon';

export type TrackerGlobals = {
	siteId: string;
	currency?: ContextCurrency;
	cart?: Product[];
};

export type TrackerEvents = 'error' | 'shopper.login' | 'product.view' | 'product.click' | 'cart.view' | 'order.transaction';

export type TrackerConfig = {
	id?: string;
	framework?: string;
	mode?: keyof typeof AppMode | AppMode;
	requesters?: {
		personalization?: {
			origin: string;
		};
		beacon?: {
			origin?: string;
		};
	};
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
	sku?: string;
	childUid?: string;
	childSku?: string;
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
