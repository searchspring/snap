import type { AbstractController } from '@searchspring/snap-controller';

export type ScrollToTopConfig = {
	enabled: boolean;
	options?: {
		top?: number;
		left?: number;
		behavior?: 'auto' | 'instant' | 'smooth';
	};
};
export const scrollToTop = async (cntrlr: AbstractController, config: ScrollToTopConfig): Promise<void> => {
	cntrlr.on('afterStore', async (_, next) => {
		if (config?.enabled) {
			const options = Object.assign({ top: 0, left: 0, behavior: 'smooth' }, config.options || {});
			setTimeout(() => {
				window.scroll(options);
			});
		}
		await next();
	});
};
