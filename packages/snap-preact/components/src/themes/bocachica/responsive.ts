import { ThemeResponsive } from '../../providers/theme';
import { mobileComponents, tabletComponents, desktopComponents } from './components';
import { mobileLayoutOptions, tabletLayoutOptions, desktopLayoutOptions } from './layoutOptions';

const mobileOverrides: ThemeResponsive = {
	layoutOptions: mobileLayoutOptions,
	components: mobileComponents,
};

const tabletOverrides: ThemeResponsive = {
	layoutOptions: tabletLayoutOptions,
	components: tabletComponents,
};

const desktopOverrides: ThemeResponsive = {
	layoutOptions: desktopLayoutOptions,
	components: desktopComponents,
};

export const responsive: [ThemeResponsive, ThemeResponsive, ThemeResponsive] = [mobileOverrides, tabletOverrides, desktopOverrides];
