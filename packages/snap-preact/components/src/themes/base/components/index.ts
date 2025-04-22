import { atoms } from './atoms';
import { molecules } from './molecules';
import { organisms } from './organisms';
import { templates } from './templates';

import type { ThemeComponents } from '../../../providers';

export const components: ThemeComponents = {
	...atoms.default,
	...molecules.default,
	...organisms.default,
	...templates.default,
};

export const mobileComponents: ThemeComponents = {
	...atoms.mobile,
	...molecules.mobile,
	...organisms.mobile,
	...templates.mobile,
};

export const tabletComponents: ThemeComponents = {
	...atoms.tablet,
	...molecules.tablet,
	...organisms.tablet,
	...templates.tablet,
};

export const desktopComponents: ThemeComponents = {
	...atoms.desktop,
	...molecules.desktop,
	...organisms.desktop,
	...templates.desktop,
};
