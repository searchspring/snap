import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { StorageStore } from '@searchspring/snap-store-mobx';
import { cookies, featureFlags } from '@searchspring/snap-toolbox';

import { TrackEvent } from './TrackEvent';
import { PixelEvent } from './PixelEvent';
import { BeaconEvent } from './BeaconEvent';
import {
	TrackingManagerGlobals,
	SearchTrackMethods,
	GlobalTrackMethods,
	AutocompleteTrackMethods,
	RecommendationsTrackMethods,
	BeaconPayload,
	BeaconType,
	BeaconCategory,
	BeaconContext,
	ProductViewEvent,
	CartViewEvent,
	OrderTransactionEvent,
} from './types';

const SEND_BEACON_EVENTS_INTERVAL = 10000; // send beacon events from pool every 10 seconds
const USERID_COOKIE_NAME = 'ssUserId';
const SHOPPERID_COOKIE_NAME = 'ssShopperId';
const COOKIE_EXPIRATION = 31536000000; // 1 year
const COOKIE_SAMESITE = undefined;
const SESSIONID_STORAGE_NAME = 'ssSessionIdNamespace';
const LOCALSTORAGE_BEACON_POOL_NAME = 'ssBeaconPool';

enum StorageType { // TODO: get export from store working
	SESSION = 'session',
	LOCAL = 'local',
	COOKIE = 'cookie',
}

export class TrackingManager {
	globals: TrackingManagerGlobals;
	localStorage: StorageStore;
	sessionStorage: StorageStore;
	context: BeaconContext;
	isSending: number;
	track: SearchTrackMethods | AutocompleteTrackMethods | RecommendationsTrackMethods | GlobalTrackMethods;
	namespace = 'beacon';

	constructor(globals?: TrackingManagerGlobals) {
		this.globals = globals;
		this.localStorage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-${this.namespace}-local`,
		});
		this.sessionStorage = new StorageStore({
			type: StorageType.SESSION,
			key: `ss-${this.namespace}-session`,
		});
		this.context = {
			...this.getUserId(),
			...this.getSessionId(),
			...this.getShopperId(),
			pageLoadId: uuidv4(),
			website: {
				trackingCode: this.globals?.siteId || undefined,
			},
		};
		this.track = {
			shopperLogin: async (shopperId: string): Promise<BeaconEvent> => {
				// sets shopperid if logged in
				if (!featureFlags.cookies) {
					return;
				}
				if (!shopperId) {
					console.error('shopperLogin event: requires a valid shopper ID parameter. Example: shopperLogin("1234")');
					return;
				}
				const storedShopperId = this.getShopperId()?.shopperId;
				shopperId = `${shopperId}`;
				if (storedShopperId != shopperId) {
					// user's logged in id has changed, update shopperId cookie send login event
					cookies.set(SHOPPERID_COOKIE_NAME, shopperId, COOKIE_SAMESITE, COOKIE_EXPIRATION);
					this.context.shopperId = shopperId;

					const beaconEvent = new BeaconEvent({
						type: BeaconType.LOGIN,
						category: BeaconCategory.PERSONALIZATION,
						context: this.context,
						event: {},
					});
					this.sendEvents([beaconEvent]);
					return beaconEvent;
				}
			},
		};
	}

	setNamespace = (configId: string): void => {
		this.namespace = `${configId}`;
		this.localStorage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-${this.namespace}-local`,
		});
		this.sessionStorage = new StorageStore({
			type: StorageType.SESSION,
			key: `ss-${this.namespace}-session`,
		});
	};

	event = (payload: BeaconPayload): BeaconEvent => {
		const event: BeaconPayload = {
			type: payload?.type || BeaconType.CUSTOM,
			category: payload?.category || BeaconCategory.CUSTOM,
			context: { ...this.context, ...payload?.context },
			event: payload.event,
			pid: payload?.pid || undefined,
		};

		const beaconEvent = new BeaconEvent(event);
		this.sendEvents([beaconEvent]);

		// Send additional event to legacy (track.json or cloudfront pixel) endpoints
		if (event.type === BeaconType.CLICK && event.category === BeaconCategory.INTERACTION) {
			// product click
			new TrackEvent(event);
		} else if (event.type === BeaconType.PRODUCT && event.category === BeaconCategory.PAGEVIEW) {
			// product page view
			if ((event.event as ProductViewEvent).sku) {
				// only send sku to pixel tracker if present (don't send childSku)
				new PixelEvent({
					...event,
					event: {
						sku: (event.event as ProductViewEvent).sku,
					},
				});
			}
		} else if (event.type === BeaconType.CART && event.category === BeaconCategory.CARTVIEW) {
			// cart view
			let sendToPixel = true;
			(event.event as CartViewEvent[]).forEach((item) => {
				if (!item?.sku) {
					// don't send to pixel tracker if any items are missing sku
					sendToPixel = false;
				}
			});
			if (sendToPixel) {
				new PixelEvent(event);
			}
		} else if (event.type === BeaconType.ORDER && event.category === BeaconCategory.ORDERVIEW) {
			// order transaction
			let sendToPixel = true;
			(event.event as OrderTransactionEvent).items.forEach((item) => {
				if (!item?.sku) {
					// don't send to pixel tracker if any items are missing sku
					sendToPixel = false;
				}
			});
			if (sendToPixel) {
				new PixelEvent(event);
			}
		}

		return beaconEvent;
	};

	init = (): void => {
		setInterval(this.sendEvents, SEND_BEACON_EVENTS_INTERVAL);
	};

	getUserId = (): Record<string, string> => {
		let userId;
		try {
			userId = featureFlags.storage && this.localStorage.get(USERID_COOKIE_NAME);
			if (featureFlags.cookies) {
				userId = userId || cookies.get(USERID_COOKIE_NAME) || uuidv4();
				cookies.set(USERID_COOKIE_NAME, userId, COOKIE_SAMESITE, COOKIE_EXPIRATION);
			} else if (!userId && featureFlags.storage) {
				// if cookies are disabled, use localStorage instead
				userId = uuidv4();
				this.localStorage.set(USERID_COOKIE_NAME, userId);
			}
		} catch (e) {
			console.error('Failed to persist user id to cookie or local storage:', e);
		}
		return { userId };
	};

	getSessionId = (): Record<string, string> => {
		let sessionId;
		if (featureFlags.storage) {
			try {
				sessionId = this.sessionStorage.get(SESSIONID_STORAGE_NAME) || uuidv4();
				this.sessionStorage.set(SESSIONID_STORAGE_NAME, sessionId);
				featureFlags.cookies && cookies.set(SESSIONID_STORAGE_NAME, sessionId, COOKIE_SAMESITE, COOKIE_EXPIRATION);
			} catch (e) {
				console.error('Failed to persist session id to session storage:', e);
			}
		} else if (featureFlags.cookies) {
			// use cookies if sessionStorage is not enabled and only reset cookie if new session to keep expiration
			sessionId = cookies.get(SESSIONID_STORAGE_NAME) || uuidv4();
			if (!sessionId) {
				sessionId = uuidv4();
				cookies.set(SESSIONID_STORAGE_NAME, sessionId, COOKIE_SAMESITE, COOKIE_EXPIRATION); // TODO: make expiration optional, no expiration = session cookie, research session cookie
			}
		}
		return { sessionId };
	};

	getShopperId = (): Record<string, string> => {
		const shopperId = cookies.get(SHOPPERID_COOKIE_NAME);
		if (!shopperId) {
			return;
		}
		return { shopperId };
	};

	addEventsToQueue = (eventPayloads: BeaconPayload[]): void => {
		if (eventPayloads?.length) {
			const events = this.getQueuedEvents();
			eventPayloads.forEach((payload) => {
				events.push(payload);
			});
			this.setBeaconEvents(events);
		}
	};

	getQueuedEvents = (): BeaconPayload[] => {
		return JSON.parse(this.localStorage.get(LOCALSTORAGE_BEACON_POOL_NAME) || '[]');
	};

	setBeaconEvents = (events: BeaconPayload[]): void => {
		this.localStorage.set(LOCALSTORAGE_BEACON_POOL_NAME, JSON.stringify(events));
	};

	clearEventQueue = (): void => {
		this.setBeaconEvents([]);
	};

	sendEvents = (eventsToSend?: BeaconEvent[]): void => {
		let events;
		let eventsFromQueue;

		if (eventsToSend) {
			console.log('sendEvents invoked');
			events = eventsToSend.map((event) => event.payload);
		} else {
			console.log('sendEvents invoked from setTimeout');
			// invoked from setTimeout
			events = eventsFromQueue = this.getQueuedEvents();
		}

		if (events.length && !this.isSending) {
			this.isSending = window.setTimeout(() => {
				fetch('https://beacon.searchspring.io/beacon', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(events.length == 1 ? events[0] : events),
				}).then((response) => {
					if (response.status === 200 && eventsFromQueue?.length) {
						this.clearEventQueue();
					}
					window.clearTimeout(this.isSending);
					this.isSending = undefined;
				});
			});
		} else if (events.length && featureFlags.storage) {
			this.addEventsToQueue(events);
		} else if (events.length && eventsToSend) {
			// storage queue is not supported, keep trying to send after delay
			new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
				this.sendEvents(eventsToSend);
			});
		}
	};
}
