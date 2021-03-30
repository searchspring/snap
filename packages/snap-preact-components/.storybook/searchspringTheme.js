import { create } from '@storybook/theming/create';

import searchspringLogo from '../src/assets/searchspring-logo.svg';

export default create({
	base: 'light',

	colorPrimary: '#3a23ad',
	colorSecondary: '#00cee1',

	// Toolbar default and active colors
	barSelectedColor: '#3a23ad',

	brandTitle: 'Searchspring SNAP Preact',
	brandImage: searchspringLogo,
});
