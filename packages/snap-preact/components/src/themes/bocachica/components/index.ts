import * as atoms from './atoms';
import * as molecules from './molecules';
import * as organisms from './organisms';
import * as templates from './templates';

import type { ThemeComponents } from '../../../providers';

export const components: ThemeComponents = {
	...atoms,
	...molecules,
	...organisms,
	...templates,
};
