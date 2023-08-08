import { Theme, PikeVariables } from '@searchspring/snap-preact-components';

export { pike } from '@searchspring/snap-preact-components';

export type PikeTheme = {
	name: 'pike';
	variables?: PikeVariables;
	overrides?: Theme & { variables?: Partial<PikeVariables> };
};
