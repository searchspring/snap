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
