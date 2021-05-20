export { ThemeProvider, useTheme, withTheme } from '@emotion/react';

export const defaultTheme: Theme = {
	colors: {
		primary: '#3A23AD',
		secondary: '#00cee1',
		hover: '#f8f6fd',
		text: {
			secondary: '#ffffff',
		},
	},
	components: {},
};

export interface Theme {
	colors?: {
		primary: string;
		secondary: string;
		hover?: string;
		text?: {
			secondary: string;
		};
	};
	components?: any;
}
