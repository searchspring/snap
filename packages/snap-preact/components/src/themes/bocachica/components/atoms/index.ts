// ATOMS
// import { badgeImage } from './badgeImage';
// import { badgePill } from './badgePill';
// import { badgeRectangle } from './badgeRectangle';
// import { badgeText } from './badgeText';
// import { banner } from './banner';
// import { breadcrumbs } from './breadcrumbs';
// import { button } from './button';
// import { dropdown } from './dropdown';
// import { formattedNumber } from './formattedNumber';
import { icon } from './icon';
// import { image } from './image';
// import { inlineBanner } from './inlineBanner';
// import { loadingBar } from './loadingBar';
// import { overlay } from './overlay';
// import { paginationInfo } from './paginationInfo';
// import { price } from './price';
// import { searchHeader } from './searchHeader';
// import { skeleton } from './skeleton';
// export { toggle } from './toggle';

import { getProps } from '../../../utils/getProps';

export const atoms = {
	default: {
		// badgeImage: badgeImage.default,
		// badgePill: badgePill.default,
		// badgeRectangle: badgeRectangle.default,
		// badgeText: badgeText.default,
		// banner: banner.default,
		// breadcrumbs: breadcrumbs.default,
		// button: button.default,
		// dropdown: dropdown.default,
		// formattedNumber: formattedNumber.default,
		...getProps('icon', icon.default),

		// image: image.default,
		// inlineBanner: inlineBanner.default,
		// loadingBar: loadingBar.default,
		// overlay: overlay.default,
		// paginationInfo: paginationInfo.default,
		// price: price.default,
		// searchHeader: searchHeader.default,
		// skeleton: skeleton.default,
	},
	mobile: {
		// badgeImage: badgeImage.mobile,
		// badgePill: badgePill.mobile,
		// badgeRectangle: badgeRectangle.mobile,
		// badgeText: badgeText.mobile,
		// banner: banner.mobile,
		// breadcrumbs: breadcrumbs.mobile,
		// button: button.mobile,
		// dropdown: dropdown.mobile,
		// formattedNumber: formattedNumber.mobile,
		...getProps('icon', icon.mobile),

		// image: image.mobile,
		// inlineBanner: inlineBanner.mobile,
		// loadingBar: loadingBar.mobile,
		// overlay: overlay.mobile,
		// paginationInfo: paginationInfo.mobile,
		// price: price.mobile,
		// searchHeader: searchHeader.mobile,
		// skeleton: skeleton.mobile,
	},
	tablet: {
		// badgeImage: badgeImage.tablet,
		// badgePill: badgePill.tablet,
		// badgeRectangle: badgeRectangle.tablet,
		// badgeText: badgeText.tablet,
		// banner: banner.tablet,
		// breadcrumbs: breadcrumbs.tablet,
		// button: button.tablet,
		// dropdown: dropdown.tablet,
		// formattedNumber: formattedNumber.tablet,
		...getProps('icon', icon.tablet),

		// image: image.tablet,
		// inlineBanner: inlineBanner.tablet,
		// loadingBar: loadingBar.tablet,
		// overlay: overlay.tablet,
		// paginationInfo: paginationInfo.tablet,
		// price: price.tablet,
		// searchHeader: searchHeader.tablet,
		// skeleton: skeleton.tablet,
	},
	desktop: {
		// badgeImage: badgeImage.desktop,
		// badgePill: badgePill.desktop,
		// badgeRectangle: badgeRectangle.desktop,
		// badgeText: badgeText.desktop,
		// banner: banner.desktop,
		// breadcrumbs: breadcrumbs.desktop,
		// button: button.desktop,
		// dropdown: dropdown.desktop,
		// formattedNumber: formattedNumber.desktop,
		...getProps('icon', icon.desktop),

		// image: image.desktop,
		// inlineBanner: inlineBanner.desktop,
		// loadingBar: loadingBar.desktop,
		// overlay: overlay.desktop,
		// paginationInfo: paginationInfo.desktop,
		// price: price.desktop,
		// searchHeader: searchHeader.desktop,
		// skeleton: skeleton.desktop,
	},
};
