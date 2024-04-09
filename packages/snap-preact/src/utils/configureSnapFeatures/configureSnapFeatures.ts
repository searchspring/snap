import deepmerge from 'deepmerge';
import type { SnapConfig } from '../../Snap';
import { DoNotTrackEntry, BeaconType, BeaconCategory } from '@searchspring/snap-tracker';

export const SHOPIFY_WEBPIXEL_STORAGE_KEY = 'ssWebPixel';

export function configureSnapFeatures(config: SnapConfig) {
	/* configure snap features by mutating the config as needed */

	configureIntegratedSpellCorrection(config);
	configureTracking(config);
}

export function configureIntegratedSpellCorrection(config: SnapConfig) {
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
	const webPixel = window.sessionStorage?.getItem(SHOPIFY_WEBPIXEL_STORAGE_KEY);
	if (webPixel) {
		try {
			const webPixelData = JSON.parse(webPixel);

			// when enabled, add certain events to doNotTrack list
			if (webPixelData?.enabled) {
				const doNotTrack: DoNotTrackEntry[] = [
					{
						type: BeaconType.PRODUCT,
						category: BeaconCategory.PAGEVIEW,
					},
					{
						type: BeaconType.CART,
						category: BeaconCategory.CARTVIEW,
					},
					{
						type: BeaconType.ORDER,
						category: BeaconCategory.ORDERVIEW,
					},
				];

				config.tracker = config.tracker || {};
				config.tracker.config = config.tracker.config || {};
				config.tracker.config.doNotTrack = (config.tracker.config.doNotTrack || []).concat(doNotTrack);
			}
		} catch (e) {}
	}
}
