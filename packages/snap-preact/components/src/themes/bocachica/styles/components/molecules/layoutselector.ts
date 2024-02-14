import { css, LayoutSelectorProps } from '../../../../../index';

// CSS in JS style script for the LayoutSelector component
const layoutSelectorStyleScript = ({ theme }: LayoutSelectorProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// LayoutSelector component props
export const layoutSelector: Partial<LayoutSelectorProps> = {
	type: 'list',
	label: '',
	styleScript: layoutSelectorStyleScript,
};
