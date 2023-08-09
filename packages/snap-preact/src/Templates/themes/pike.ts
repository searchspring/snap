import { Theme, PikeTheme, PikeVariables } from '@searchspring/snap-preact-components';

export { pike } from '@searchspring/snap-preact-components';

export type PikeTemplateTheme = {
	name: 'pike';
	variables?: PikeVariables;
	overrides?: Theme & Partial<PikeTheme>;
};
