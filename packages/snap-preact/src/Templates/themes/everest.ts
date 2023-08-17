import { Theme, EverestTheme, EverestVariables } from '@searchspring/snap-preact-components';

export { everest } from '@searchspring/snap-preact-components';

export type EverestTemplateTheme = {
	name: 'everest';
	variables?: EverestVariables;
	overrides?: Theme & Partial<EverestTheme>;
};
