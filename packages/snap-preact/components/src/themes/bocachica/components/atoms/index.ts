import { ThemeResponsiveComplete } from '../../../../providers';
import { transformThemeComponent } from '../../../utils/transformThemeComponent';

// ATOMS Imports
import { button } from './button';
import { dropdown } from './dropdown';
import { icon } from './icon';
import { image } from './image';
import { loadingBar } from './loadingBar';
import { price } from './price';
import { searchHeader } from './searchHeader';
import { skeleton } from './skeleton';

export const atoms: ThemeResponsiveComplete = {
	default: {
		...transformThemeComponent('button', button.default),
		...transformThemeComponent('dropdown', dropdown.default),
		...transformThemeComponent('icon', icon.default),
		...transformThemeComponent('image', image.default),
		...transformThemeComponent('loadingBar', loadingBar.default),
		...transformThemeComponent('price', price.default),
		...transformThemeComponent('searchHeader', searchHeader.default),
		...transformThemeComponent('skeleton', skeleton.default),
	},
	mobile: {
		...transformThemeComponent('button', button.mobile),
		...transformThemeComponent('dropdown', dropdown.mobile),
		...transformThemeComponent('icon', icon.mobile),
		...transformThemeComponent('image', image.mobile),
		...transformThemeComponent('loadingBar', loadingBar.mobile),
		...transformThemeComponent('price', price.mobile),
		...transformThemeComponent('searchHeader', searchHeader.mobile),
		...transformThemeComponent('skeleton', skeleton.mobile),
	},
	tablet: {
		...transformThemeComponent('dropdown', dropdown.tablet),
		...transformThemeComponent('icon', icon.tablet),
		...transformThemeComponent('image', image.tablet),
		...transformThemeComponent('loadingBar', loadingBar.tablet),
		...transformThemeComponent('price', price.tablet),
		...transformThemeComponent('searchHeader', searchHeader.tablet),
		...transformThemeComponent('skeleton', skeleton.tablet),
	},
	desktop: {
		...transformThemeComponent('button', button.desktop),
		...transformThemeComponent('dropdown', dropdown.desktop),
		...transformThemeComponent('icon', icon.desktop),
		...transformThemeComponent('image', image.desktop),
		...transformThemeComponent('loadingBar', loadingBar.desktop),
		...transformThemeComponent('price', price.desktop),
		...transformThemeComponent('searchHeader', searchHeader.desktop),
		...transformThemeComponent('skeleton', skeleton.desktop),
	},
};
