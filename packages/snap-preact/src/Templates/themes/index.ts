import { PikeTemplateTheme } from './pike';
import { EverestTemplateTheme } from './everest';

export type TemplateThemeConfig = {
	name: 'pike' | 'everest'; // TODO: figure out why "keyof typeof themeMap" doesn't work here
	variables?: {
		breakpoints: number[];
	};
} & Partial<PikeTemplateTheme | EverestTemplateTheme>;

export const themeMap = {
	pike: async () => {
		return (await import('./pike')).pike;
	},
	everest: async () => {
		return (await import('./everest')).everest;
	},
};
