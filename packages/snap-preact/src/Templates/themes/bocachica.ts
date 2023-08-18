import { Theme, BocachicaTheme, BocachicaVariables } from '@searchspring/snap-preact-components';

export { bocachica } from '@searchspring/snap-preact-components';

export type BocachicaTemplateTheme = {
	name: 'bocachica';
	variables?: BocachicaVariables;
	overrides?: Theme & Partial<BocachicaTheme>;
};
