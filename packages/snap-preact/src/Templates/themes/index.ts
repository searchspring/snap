import { PikeTemplateTheme } from './pike';
import { BocachicaTemplateTheme } from './bocachica';

export type TemplateThemeConfig = {
	name: 'pike' | 'bocachica'; // TODO: figure out why "keyof typeof themeMap" doesn't work here
	variables?: {
		breakpoints: number[];
	};
} & Partial<PikeTemplateTheme | BocachicaTemplateTheme>;

export const themeMap = {
	pike: async () => {
		return (await import('./pike')).pike;
	},
	bocachica: async () => {
		return (await import('./bocachica')).bocachica;
	},
};
