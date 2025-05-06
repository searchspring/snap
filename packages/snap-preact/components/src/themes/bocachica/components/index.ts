import { atoms } from './atoms';
import { molecules } from './molecules';
import { organisms } from './organisms';
import { templates } from './templates';

import type { ThemeComponentRestrictedOverrides } from '../../../providers';

export const components: ThemeComponentRestrictedOverrides = {
	...atoms.default,
	...molecules.default,
	...organisms.default,
	...templates.default,
};

export const mobileComponents: ThemeComponentRestrictedOverrides = {
	...atoms.mobile,
	...molecules.mobile,
	...organisms.mobile,
	...templates.mobile,
};

export const tabletComponents: ThemeComponentRestrictedOverrides = {
	...atoms.tablet,
	...molecules.tablet,
	...organisms.tablet,
	...templates.tablet,
};

export const desktopComponents: ThemeComponentRestrictedOverrides = {
	...atoms.desktop,
	...molecules.desktop,
	...organisms.desktop,
	...templates.desktop,
};
