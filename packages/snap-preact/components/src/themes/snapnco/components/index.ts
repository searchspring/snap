import { atoms } from './atoms';
import { molecules } from './molecules';
import { organisms } from './organisms';
import { templates } from './templates';

import type { ThemeComponentsRestrictedOverrides } from '../../../providers';

export const components: ThemeComponentsRestrictedOverrides = {
	...atoms.default,
	...molecules.default,
	...organisms.default,
	...templates.default,
};

export const mobileComponents: ThemeComponentsRestrictedOverrides = {
	...atoms.mobile,
	...molecules.mobile,
	...organisms.mobile,
	...templates.mobile,
};

export const tabletComponents: ThemeComponentsRestrictedOverrides = {
	...atoms.tablet,
	...molecules.tablet,
	...organisms.tablet,
	...templates.tablet,
};

export const desktopComponents: ThemeComponentsRestrictedOverrides = {
	...atoms.desktop,
	...molecules.desktop,
	...organisms.desktop,
	...templates.desktop,
};
