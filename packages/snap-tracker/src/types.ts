import { BeaconEvent } from './BeaconEvent';

export type TrackingManagerGlobals = {
	siteId: string;
};

export interface BeaconPayload {
	type: BeaconType;
	category: BeaconCategory;
	context?: BeaconContext;
	meta?: BeaconMeta;
	event:
		| ProductViewEvent
		| CartViewEvent[]
		| OrderTransactionEvent
		| RecommendationsEvent
		| TrackClickEvent
		| CustomBeaconEvent
		| Record<string, never>;
	id?: string;
	pid?: string | null;
}

export enum BeaconType {
	PRODUCT = 'product',
	CART = 'cart',
	ORDER = 'transaction',
	LOGIN = 'login',
	CLICK = 'click',
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
	};
}

export interface ProductViewEvent {
	sku?: string;
	childSku?: string;
}
export interface CartViewEvent {
	sku: string;
	childSku?: string;
	qty: string | number;
	price: string | number;
}

export interface OrderTransactionEvent {
	orderId?: string | number;
	total?: string | number;
	city?: string;
	state?: string;
	country?: string;

	items: CartViewEvent[];
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

export interface TrackClickEvent {
	intellisuggestData: string;
	intellisuggestSignature: string;
	href?: string;
}

export interface CustomBeaconEvent {
	[key: string]: any;
}

export interface GlobalTrackMethods {
	shopperLogin: (shopperId: string) => Promise<BeaconEvent>;
}

export interface SearchTrackMethods extends GlobalTrackMethods {
	product: {
		click: (data: TrackClickEvent) => Promise<BeaconEvent>;
		view: (data: ProductViewEvent) => Promise<BeaconEvent>;
	};
	personalization: {
		login: (shopperId: string) => Promise<BeaconEvent>;
	};
	cart: {
		view: (data: CartViewEvent[]) => Promise<BeaconEvent>;
	};
	order: {
		transaction: (data: OrderTransactionEvent) => Promise<BeaconEvent>;
	};
}

export interface AutocompleteTrackMethods extends GlobalTrackMethods {
	product: {
		click: (data: TrackClickEvent) => Promise<BeaconEvent>;
		view: (data: ProductViewEvent) => Promise<BeaconEvent>;
	};
}

export interface RecommendationsTrackMethods extends GlobalTrackMethods {
	todo: string;
	// TODO: this
}
