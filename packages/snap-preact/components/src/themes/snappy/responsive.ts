import { ThemeResponsive } from '../../providers/theme';
import { mobileComponents, tabletComponents, desktopComponents } from './components';

export const responsive: ThemeResponsive = {
	mobile: mobileComponents,
	tablet: tabletComponents,
	desktop: desktopComponents,
};
