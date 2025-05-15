import { ThemeComponents, ThemeComponentsRestricted, ThemeComponentsRestrictedOverrides, ThemeComponentTemplateOverrides } from './themeComponents';
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
	responsive?: ThemeResponsive;
	components?: ThemeComponents;
	overrides?: ThemeOverrides;
};

export type ThemeComponent<Template extends string, Props> = {
	default?: ThemeComponentTemplateOverrides<Template, Props>;
	mobile?: ThemeComponentTemplateOverrides<Template, Props>;
	tablet?: ThemeComponentTemplateOverrides<Template, Props>;
	desktop?: ThemeComponentTemplateOverrides<Template, Props>;
};

export type ThemeComplete = Required<Omit<Theme, 'overrides'>> & { components: ThemeComponents };

export type ThemeResponsive = {
	mobile?: ThemeComponentsRestricted;
	tablet?: ThemeComponentsRestricted;
	desktop?: ThemeComponentsRestricted;
};

export type ThemeResponsiveComplete = ThemeResponsive & { default?: ThemeComponentsRestricted };

export type ThemeResponsiveOverrides = {
	mobile?: ThemeComponentsRestrictedOverrides;
	tablet?: ThemeComponentsRestrictedOverrides;
	desktop?: ThemeComponentsRestrictedOverrides;
};

export type ThemePartial = Omit<Theme, 'variables' | 'name'> & { variables?: ThemeVariablesPartial };
export type ThemeOverrides = { components?: ThemeComponentsRestrictedOverrides; responsive?: ThemeResponsiveOverrides };
export type ThemeMinimal = { components?: ThemeComponents };
