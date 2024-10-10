import type { AbstractController } from '@searchspring/snap-controller';

export type PluginScrollToTopConfig = {
	enabled: boolean;
	selector?: string;
	options?: {
		top?: number;
		left?: number;
		behavior?: 'auto' | 'instant' | 'smooth';
	};
};
export const pluginScrollToTop = async (cntrlr: AbstractController, config: PluginScrollToTopConfig): Promise<void> => {
	if (!config?.enabled || cntrlr.type !== 'search') {
		return;
	}

	cntrlr.on('afterStore', async (_, next) => {
		const options = Object.assign({ top: 0, left: 0, behavior: 'smooth' }, config.options || {});

		if (config.selector) {
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
