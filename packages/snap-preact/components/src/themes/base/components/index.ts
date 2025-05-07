import { atoms } from './atoms';
import { molecules } from './molecules';
import { organisms } from './organisms';
import { templates } from './templates';

import type { ThemeComponentsRestricted } from '../../../providers';

export const components: ThemeComponentsRestricted = {
	...atoms.default,
	...molecules.default,
	...organisms.default,
	...templates.default,
};

export const mobileComponents: ThemeComponentsRestricted = {
	...atoms.mobile,
	...molecules.mobile,
	...organisms.mobile,
	...templates.mobile,
};

export const tabletComponents: ThemeComponentsRestricted = {
	...atoms.tablet,
	...molecules.tablet,
	...organisms.tablet,
	...templates.tablet,
};

export const desktopComponents: ThemeComponentsRestricted = {
	...atoms.desktop,
	...molecules.desktop,
	...organisms.desktop,
	...templates.desktop,
};
