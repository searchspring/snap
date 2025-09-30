import deepmerge from 'deepmerge';
import type { TrackerEvents } from '@searchspring/snap-tracker';
import type { SnapConfig } from './Snap';

export const SHOPIFY_WEBPIXEL_STORAGE_KEY = 'ssWebPixel';

export function configureSnapFeatures(config: SnapConfig) {
	/* configure snap features by mutating the config as needed */

	configureIntegratedSpellCorrection(config);
	configureTracking(config);
}

function configureIntegratedSpellCorrection(config: SnapConfig) {
	if (config.features?.integratedSpellCorrection?.enabled) {
		if (config.client) {
			config.client.config = deepmerge(
				{
					autocomplete: {
						requesters: {
							suggest: {
								globals: {
									integratedSpellCorrection: true,
								},
							},
						},
					},
				},
				config.client.config || {}
			);
		}

		// loop through controllers config and toggle integratedSpellCorrection setting
		Object.keys(config?.controllers || {}).forEach((type) => {
			switch (type) {
				case 'autocomplete': {
					config.controllers![type]!.forEach((controller) => {
						if (typeof controller.config?.settings?.integratedSpellCorrection == 'undefined') {
							// enable integratedSpellCorrection controller setting
							controller.config.settings = deepmerge({ integratedSpellCorrection: true }, controller.config.settings || {});
						}

						if (controller.config?.settings?.integratedSpellCorrection) {
							// set spell correction globals for convenience
							controller.config.globals = deepmerge(
								{
									search: {
										query: {
											spellCorrection: true,
										},
									},
								},
								controller.config.globals || {}
							);
						}
					});
					break;
				}
			}
		});
	}
}

function configureTracking(config: SnapConfig) {
	// Searchspring's Shopify Web Pixel App compatibility
	let webPixel;
	try {
		webPixel = window.sessionStorage?.getItem(SHOPIFY_WEBPIXEL_STORAGE_KEY);
	} catch {
		// storage not enabled
	}

	if (webPixel) {
		try {
			const webPixelData = JSON.parse(webPixel);

			// when enabled, add certain events to doNotTrack list
			if (webPixelData?.enabled) {
				const doNotTrack: TrackerEvents[] = ['product.view', 'cart.view', 'order.transaction'];

				config.tracker = config.tracker || {};
				config.tracker.config = config.tracker.config || {};
				config.tracker.config.doNotTrack = (config.tracker.config.doNotTrack || []).concat(doNotTrack);
			}
		} catch {
			// storage not enabled
		}
	}
}
