import { ThemeResponsive } from '../../providers/theme';
import { mobileComponents, tabletComponents, desktopComponents } from './components';

const mobileOverrides: ThemeResponsive = {
	components: mobileComponents,
};

const tabletOverrides: ThemeResponsive = {
	components: tabletComponents,
};

const desktopOverrides: ThemeResponsive = {
	components: desktopComponents,
};

export const responsive = {
	mobile: mobileOverrides,
	tablet: tabletOverrides,
	desktop: desktopOverrides,
};
