import deepmerge from 'deepmerge';
import type { SnapConfig } from './Snap';

export function configureSnapFeatures(config: SnapConfig) {
	/* configure snap features by mutating the config as needed */

	configureIntegratedSpellCorrection(config);
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
