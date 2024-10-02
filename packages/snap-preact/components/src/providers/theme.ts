import { ThemeComponentOverrides } from './themeComponents';
import { ListOption } from '../types';
import type { DeepPartial } from '../../../src/types';

export { css, useTheme, withTheme, ThemeProvider } from '@emotion/react';

export const defaultTheme: Theme = {
	variables: {
		breakpoints: [540, 767, 1200],
		colors: {
			primary: '#3A23AD',
			secondary: '#00cee1',
			accent: '#4c3ce2',
			active: {
				foreground: '#333333',
				background: '#f8f6fd',
				accent: '#3A23AD',
			},
			hover: {
				foreground: '#333333',
				background: '#f8f6fd',
				accent: '#3A23AD',
			},
		},
	},
};

type ThemeVariableBreakpoints = [number, number, number];
type ThemeVaraibleColors = {
	primary: string; // (search header text, regular text, result title)
	secondary: string; // (headings, dropdown button text)
	accent: string; // (icons, borders)
	active: {
		foreground: string; // (active state text)
		background: string; // (active state)
		accent: string; // (icons, borders)
	};
	hover: {
		foreground: string; // (active state text)
		background: string; // (active state)
		accent: string; // (icons, borders)
	};
};

export type ThemeVariables = {
	breakpoints: ThemeVariableBreakpoints;
	colors: ThemeVaraibleColors;
};

export type ThemeVariablesPartial = {
	breakpoints?: ThemeVariableBreakpoints;
	colors?: DeepPartial<ThemeVaraibleColors>;
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
