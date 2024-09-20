// .storybook/manager.js
// used to style up the UI - using Searchspring Custom Theme

import { addons } from '@storybook/addons';
import searchspringTheme from './searchspringTheme';

addons.setConfig({
	theme: searchspringTheme,
});
