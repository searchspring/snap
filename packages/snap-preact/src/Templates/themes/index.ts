import { PikeTemplateTheme } from './pike';
import { BocachicaTemplateTheme } from './bocachica';
import { Theme } from '@searchspring/snap-preact-components';

export type TemplateThemeConfig = {
	name: keyof typeof themeMap;
	variables?: {
		breakpoints: number[];
	};
} & Partial<PikeTemplateTheme | BocachicaTemplateTheme>;

export const themeMap = {
	pike: async () => {
		return (await import('./pike')).pike as Theme;
	},
	bocachica: async () => {
		return (await import('./bocachica')).bocachica as Theme;
	},
};
