export { css, useTheme, withTheme, ThemeProvider } from '@emotion/react';

export const defaultTheme: Theme = {
	colors: {
		primary: '#3A23AD',
		secondary: '#00cee1',
		hover: '#f8f6fd',
		text: {
			secondary: '#ffffff',
		},
		message: {
			error: '#cc1212',
			warning: '#ecaa15',
			info: '#4c3ce2',
		},
	},
	components: {},
};
export interface Theme {
	variables?: {
		[key: string]: unknown;
	};
	colors?: {
		primary: string;
		secondary: string;
		hover?: string;
		text?: {
			secondary: string;
		};
		message?: {
			error: string;
			warning: string;
			info: string;
		};
	};
	components?: any;
	namedComponents?: any;
}
