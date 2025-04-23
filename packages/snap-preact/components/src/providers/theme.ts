import { ThemeComponentOverrides, ThemeComponentRestrictedOverrides, ThemeComponents } from './themeComponents';
import { ListOption } from '../types';

export { css, useTheme, withTheme, ThemeProvider } from '@emotion/react';

export const defaultTheme: Theme = {
	variables: {
		breakpoints: [540, 767, 1200],
		colors: {
			text: '#222222',
			primary: '#3A23AD',
			secondary: '#4c3ce2',
			accent: '#00cee1',
		},
	},
};

type ThemeVariableBreakpoints = [number, number, number];
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
	responsive?: [ThemeResponsive, ThemeResponsive, ThemeResponsive];
	components?: ThemeComponentOverrides;
	layoutOptions?: ThemeLayoutOption[];
	overrides?: ThemeOverrides;
};

export type ThemeComplete = Required<Omit<Theme, 'overrides'>> & { components: ThemeComponents };

export type ThemeResponsive = Pick<Theme, 'layoutOptions'> & { components?: ThemeComponentRestrictedOverrides };
export type ThemePartial = Omit<Theme, 'variables' | 'name'> & { variables?: ThemeVariablesPartial };
export type ThemeOverrides = Pick<Theme, 'layoutOptions' | 'responsive'> & { components?: ThemeComponentRestrictedOverrides };
export type ThemeMinimal = Pick<Theme, 'components'>;
