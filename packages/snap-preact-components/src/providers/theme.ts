export { ThemeProvider, useTheme, withTheme } from '@emotion/react';

export const defaultTheme: Theme = {
	colorPrimary: '#3A23AD',
	colorSecondary: '#FFF',
	colors: {
		primary: '#3A23AD',
		secondary: '#FFF',
	},
	components: {},
};

export interface Theme {
	colors?: {
		primary: string;
		secondary: string;
	};
	colorPrimary?: string;
	colorSecondary?: string;
	components?: any;
}
