import { create } from '@storybook/theming/create';

import searchspringLogo from './searchspring-logo.svg';

export default create({
	base: 'light',

	colorPrimary: '#3a23ad',
	colorSecondary: '#00cee1',

	appBg: '#fafafa',
	// Toolbar default and active colors
	barSelectedColor: '#3a23ad',

	brandTitle: 'Searchspring Snap Preact',
	brandImage: searchspringLogo,
});
