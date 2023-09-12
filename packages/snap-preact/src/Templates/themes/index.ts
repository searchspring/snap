import { Theme } from '@searchspring/snap-preact-components';
import { PikeTemplateTheme } from './pike';

export type TemplateThemeConfig = {
	name: keyof typeof themeMap;
	variables?: {
		breakpoints: number[];
	};
} & Partial<PikeTemplateTheme>;

export const themeMap = {
	pike: async () => {
		return (await import('./pike')).pike;
	},
};

export type SnapThemeConfig = {
	name: keyof typeof themeMap;
	import: () => Promise<Theme>;
	variables?: any;
	overrides?: any;
};
