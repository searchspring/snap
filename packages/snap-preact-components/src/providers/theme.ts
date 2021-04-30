export { ThemeProvider, useTheme, withTheme } from '@emotion/react';

export const defaultTheme: Theme = {
	colors: {
		primary: '#3A23AD',
		secondary: '#00cee1',
	},
	components: {},
};

export interface Theme {
	colors?: {
		primary: string;
		secondary: string;
	};
	components?: any;
}
