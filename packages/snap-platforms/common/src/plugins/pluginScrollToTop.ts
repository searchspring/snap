import type { AbstractController } from '@searchspring/snap-controller';
import { AbstractPluginConfig } from '../types';

export type ScrollBehavior = 'auto' | 'instant' | 'smooth';
export type PluginScrollToTopConfig = {
	selector?: string;
	options?: {
		top?: number;
		left?: number;
		behavior?: ScrollBehavior;
	};
} & AbstractPluginConfig;

export const pluginScrollToTop = (cntrlr: AbstractController, config?: PluginScrollToTopConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	// only applies to search controllers
	if (cntrlr.type != 'search') return;

	cntrlr.on('beforeSearch', async (_, next) => {
		const options = Object.assign({ top: 0, left: 0, behavior: 'smooth' }, config?.options || {});

		if (config?.selector) {
			const element = document.querySelector(config.selector);
			if (element) {
				const { top } = element.getBoundingClientRect();
				options.top += top;
			}
		}

		setTimeout(() => {
			window.scroll(options);
		});

		await next();
	});
};
