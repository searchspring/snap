import { BeaconEvent } from './BeaconEvent';

export type TrackerGlobals = {
	siteId: string;
};

export type TrackerConfig = {
	id?: string;
	framework?: string;
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

export enum BeaconType {
	PRODUCT = 'product',
	CART = 'cart',
	ORDER = 'transaction',
	LOGIN = 'login',
	CLICK = 'click',
	ERROR = 'error',
	CUSTOM = 'custom',

	/** For Profiles Recommendations */
	PROFILE_RENDER = 'profile.render', // A profile is loaded onto the page.
	PROFILE_IMPRESSION = 'profile.impression', // A profile is visible to the shopper (within viewport, not hidden). If determining visibility is not possible, this can be sent at the same time as a profile.render event.
	PROFILE_CLICK = 'profile.click', // Any area of the profile is clicked.

	/** For Recommended Products within a Profile */
	PROFILE_PRODUCT_RENDER = 'profile.product.render', // A recommended product is loaded onto the page.
	PROFILE_PRODUCT_IMPRESSION = 'profile.product.impression', // A recommended product is visible to the shopper (within viewport, not hidden). If determining visibility is not possible, this can be sent at the same time as a profile.product.render event.
	PROFILE_PRODUCT_CLICK = 'profile.product.click', // A recommended product is clicked.
}

export enum BeaconCategory {
	PAGEVIEW = 'searchspring.page.view',
	CARTVIEW = 'searchspring.shop.cart',
	ORDERVIEW = 'searchspring.shop.transaction',
	PERSONALIZATION = 'searchspring.personalization',
	RECOMMENDATIONS = 'searchspring.recommendations.user-interactions',
	INTERACTION = 'searchspring.user-interactions',
	RUNTIME = 'searchspring.js.runtime',
	CUSTOM = 'custom',
}

export interface BeaconContext {
	userId?: string;
	pageLoadId?: string;
	sessionId?: string;
	shopperId?: string;
	website: {
		trackingCode: string;
	};
}

export interface BeaconMeta {
	initiator: {
		lib: string;
		'lib.version': string;
		framework: string;
	};
}

export interface ShopperLoginEvent {
	id: string;
}
export interface TrackErrorEvent {
	userAgent?: string;
	href?: string;
	filename?: string;
	stack?: string;
	message?: string;
	colno?: number;
	lineno?: number;
	timeStamp?: number;
}
export interface ProductViewEvent {
	sku?: string;
	childSku?: string;
}
export interface CartViewEvent {
	items: Product[];
}

export interface Product extends ProductViewEvent {
	qty: string | number;
	price: string | number;
}

export interface OrderTransactionEvent {
	orderId?: string | number;
	total?: string | number;
	city?: string;
	state?: string;
	country?: string;
	items: Product[];
}

export interface OrderTransactionData {
	order?: {
		id?: string | number;
		total?: string | number;
		city?: string;
		state?: string;
		country?: string;
	};
	items: Product[];
}

export interface RecommendationsEvent {
	profile?: {
		tag?: string;
		placement?: string;
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
		placement?: string;
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
	event: (payload: BeaconPayload) => BeaconEvent;
	error: (data: TrackErrorEvent) => BeaconEvent | undefined;
	shopper: {
		login: (data: ShopperLoginEvent, siteId?: string) => BeaconEvent | undefined;
	};
	product: {
		view: (data: ProductViewEvent, siteId?: string) => BeaconEvent | undefined;
		click: (data: ProductClickEvent, siteId?: string) => BeaconEvent | undefined;
	};
	cart: {
		view: (data: CartViewEvent, siteId?: string) => BeaconEvent | undefined;
	};
	order: {
		transaction: (data: OrderTransactionData, siteId?: string) => BeaconEvent | undefined;
	};
}

declare global {
	interface Window {
		searchspring?: any;
	}
}
