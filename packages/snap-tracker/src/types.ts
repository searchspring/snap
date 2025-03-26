import { AppMode } from '@searchspring/snap-toolbox';
import { BeaconEvent } from './BeaconEvent';
import type { ContextCurrency } from '@searchspring/beacon';

export type TrackerGlobals = {
	siteId: string;
	currency?: ContextCurrency;
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

export type BeaconPayload = {
	type: BeaconType;
	category: BeaconCategory;
	context?: BeaconContext;
	meta?: BeaconMeta;
	event:
		| ProductViewEvent
		| CartViewEvent
		| OrderTransactionEvent
		| RecommendationsEvent
		| ProductClickEvent
		| CustomBeaconEvent
		| Record<string, never>;
	id?: string;
	pid?: string | null;
};

// TODO: remove when 1.0 is sunset
export enum BeaconType {
	CLICK = 'click',
}
// TODO: remove when 1.0 is sunset
export enum BeaconCategory {
	INTERACTION = 'searchspring.user-interactions',
}

export enum ProfilePlacement {
	BASKETPAGE = 'basket-page',
	CONFIRMATIONPAGE = 'confirmation-page',
	PRODUCTPAGE = 'product-page',
	NORESULTSPAGE = 'no-results-page',
	HOMEPAGE = 'home-page',
	OTHER = 'other',
}

export interface BeaconContext {
	userId?: string;
	pageLoadId?: string;
	sessionId?: string;
	shopperId?: string;
	website: {
		trackingCode: string;
	};
	attribution?: {
		type?: string;
		id?: string;
	};
	currency?: ContextCurrency;
}

export interface BeaconMeta {
	initiator: {
		lib: string;
		'lib.version': string;
		'lib.framework': string;
	};
}

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
export interface CartViewEvent {
	items: ProductData[];
}

export interface ProductData extends ProductViewEvent {
	qty: string | number;
	price: string | number;
}

export interface OrderTransactionEvent {
	orderId?: string | number;
	total?: string | number;
	transactionTotal?: string | number;
	city?: string;
	state?: string;
	country?: string;
	items: ProductData[];
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

export interface RecommendationsEvent {
	profile?: {
		tag?: string;
		placement?: ProfilePlacement;
		seed?: ProductViewEvent[];
	};
	product?: {
		id?: string;
		mappings?: {
			core?: {
				sku?: string;
				name?: string;
				url?: string;
				thumbnailImageUrl?: string;
				price?: number;
				msrp?: number;
			};
		};
		seed?: ProductViewEvent[];
	};
	context?: {
		type?: string;
		tag?: string;
		placement?: ProfilePlacement;
	};
}
export interface ProductClickEvent {
	intellisuggestData: string;
	intellisuggestSignature: string;
	href?: string;
}

export interface CustomBeaconEvent {
	[key: string]: any;
}

export type PreflightRequestModel = {
	userId: string;
	siteId: string;
	shopper?: string;
	cart?: string[];
	lastViewed?: string[];
};

export interface TrackMethods {
	error: (data: TrackErrorEvent) => undefined;
	shopper: {
		login: (data: ShopperLoginEvent, siteId?: string) => undefined;
	};
	product: {
		view: (data: ProductViewEvent, siteId?: string) => undefined;
		click: (data: ProductClickEvent, siteId?: string) => BeaconEvent | undefined;
	};
	cart: {
		view: (data: CartViewEvent, siteId?: string) => undefined;
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
