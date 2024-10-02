import { ThemeComponentOverrides } from './themeComponents';
import { ListOption } from '../types';

export { css, useTheme, withTheme, ThemeProvider } from '@emotion/react';

export const defaultTheme: Theme = {
	variables: {
		breakpoints: [540, 767, 1200],
		colors: {
			primary: '#3A23AD',
			secondary: '#4c3ce2',
			accent: '#00cee1',
		},
	},
};

type ThemeVariableBreakpoints = [number, number, number];
type ThemeVaraibleColors = {
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

export type Theme = {
	name?: string; // Used as a flag in components to provide backwards compatability
	variables?: ThemeVariables;
	responsive?: [ThemeResponsive, ThemeResponsive, ThemeResponsive];
	components?: ThemeComponentOverrides;
	layoutOptions?: (Omit<ListOption, 'overrides'> & { overrides: ThemeMinimal })[];
};

export type ThemeResponsive = Pick<Theme, 'components' | 'layoutOptions'>;
export type ThemePartial = Omit<Theme, 'variables' | 'name'> & { variables?: ThemeVariablesPartial };
export type ThemeOverrides = Pick<Theme, 'components' | 'layoutOptions' | 'responsive'>;
export type ThemeMinimal = Pick<Theme, 'components'>;
