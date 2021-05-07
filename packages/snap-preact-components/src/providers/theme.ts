export { ThemeProvider, useTheme, withTheme } from '@emotion/react';

export const defaultTheme: Theme = {
	colors: {
		primary: '#3A23AD',
		primaryBgText: '#ffffff',
		secondary: '#00cee1',
		hover: '#f8f6fd',
	},
	components: {},
};

export interface Theme {
	colors?: {
		primary: string;
		primaryBgText?: string;
		secondary: string;
		hover?: string;
	};
	components?: any;
}
