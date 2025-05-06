import { ThemeComponentRestrictedOverrides, ThemeComponents, ThemeTemplateComponentOverrides } from './themeComponents';
import { ListOption } from '../types';

export { css, useTheme, withTheme, ThemeProvider } from '@emotion/react';

export const defaultTheme: Theme = {
	variables: {
		breakpoints: {
			mobile: 540,
			tablet: 767,
			desktop: 1200,
		},
		colors: {
			text: '#222222',
			primary: '#3A23AD',
			secondary: '#4c3ce2',
			accent: '#00cee1',
		},
	},
};

export type ThemeVariableBreakpoints = {
	mobile: number;
	tablet: number;
	desktop: number;
};
type ThemeVaraibleColors = {
	text?: string;
	primary: string;
	secondary: string;
	accent: string;
};

export type ThemeVariables = {
	breakpoints: ThemeVariableBreakpoints;
	colors: ThemeVaraibleColors;
};

export type ThemeVariablesPartial = {
	breakpoints?: ThemeVariableBreakpoints;
	colors?: ThemeVaraibleColors;
};

export type ThemeLayoutOption = Omit<ListOption, 'overrides'> & { overrides?: ThemeMinimal };

export type Theme = {
	name?: string; // Used as a flag in components to provide backwards compatability
	variables?: ThemeVariables;
	responsive?: {
		default?: ThemeResponsive;
		mobile?: ThemeResponsive;
		tablet?: ThemeResponsive;
		desktop?: ThemeResponsive;
	};
	// TODO: remove components
	components?: any;
	overrides?: ThemeOverrides;
};

export type ThemeTemplate<ComponentName extends string, ComponentProps> = {
	default?: ThemeTemplateProperties<ComponentName, ComponentProps>;
	mobile?: ThemeTemplateProperties<ComponentName, ComponentProps>;
	tablet?: ThemeTemplateProperties<ComponentName, ComponentProps>;
	desktop?: ThemeTemplateProperties<ComponentName, ComponentProps>;
};

export type ThemeTemplateProperties<ComponentName extends string, ComponentProps> = {
	props?: Partial<ComponentProps>;
	components?: ThemeTemplateComponentOverrides<`*${ComponentName}`>;
};

export type ThemeComplete = Required<Omit<Theme, 'overrides'>> & { components: ThemeComponents };

export type ThemeResponsive = { components?: ThemeComponentRestrictedOverrides };
export type ThemePartial = Omit<Theme, 'variables' | 'name'> & { variables?: ThemeVariablesPartial };
export type ThemeOverrides = Pick<Theme, 'responsive'> & { components?: ThemeComponentRestrictedOverrides };
export type ThemeMinimal = Pick<Theme, 'components'>;
