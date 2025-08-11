import { create } from '@storybook/theming/create';

import athosLogo from '../src/assets/athos_logo.svg';

export default create({
	base: 'light',

	colorPrimary: '#1D4990',
	colorSecondary: '#00AEEF',

	appBg: '#fafafa',
	// Toolbar default and active colors
	barSelectedColor: '#1D4990',

	brandTitle: 'Searchspring Snap Preact',
	brandImage: athosLogo,
});
