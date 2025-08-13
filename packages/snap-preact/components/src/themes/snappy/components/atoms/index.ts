import { ThemeResponsiveComplete } from '../../../../providers';

// ATOMS Imports
import { button } from './button';
import { dropdown } from './dropdown';
import { icon } from './icon';
import { image } from './image';
import { loadingBar } from './loadingBar';
import { price } from './price';
import { searchHeader } from './searchHeader';
import { skeleton } from './skeleton';
import { calloutBadge } from './calloutBadge';

export const atoms: ThemeResponsiveComplete = {
	default: {
		...button.default,
		...dropdown.default,
		...icon.default,
		...image.default,
		...loadingBar.default,
		...price.default,
		...searchHeader.default,
		...skeleton.default,
		...calloutBadge.default,
	},
	mobile: {
		...button.mobile,
		...dropdown.mobile,
		...icon.mobile,
		...image.mobile,
		...loadingBar.mobile,
		...price.mobile,
		...searchHeader.mobile,
		...skeleton.mobile,
		...calloutBadge.mobile,
	},
	tablet: {
		...dropdown.tablet,
		...icon.tablet,
		...image.tablet,
		...loadingBar.tablet,
		...price.tablet,
		...searchHeader.tablet,
		...skeleton.tablet,
		...calloutBadge.tablet,
	},
	desktop: {
		...button.desktop,
		...dropdown.desktop,
		...icon.desktop,
		...image.desktop,
		...loadingBar.desktop,
		...price.desktop,
		...searchHeader.desktop,
		...skeleton.desktop,
		...calloutBadge.desktop,
	},
};
