import { PikeTheme } from './pike';

export type TemplateThemeConfig = {
	name: keyof typeof themeMap;
	variables?: {
		breakpoints: number[];
	};
} & Partial<PikeTheme>;

export const themeMap = {
	pike: async () => {
		return (await import('./pike')).pike;
	},
};
