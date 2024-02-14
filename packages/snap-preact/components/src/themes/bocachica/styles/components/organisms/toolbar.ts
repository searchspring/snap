import { css, ToolbarProps } from '../../../../../index';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = ({ theme }: ToolbarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',

		'&.ss__search__content__toolbar--bottom-toolbar': {
			justifyContent: 'center',
		},
	});
};

// Toolbar component props
export const toolbar: Partial<ToolbarProps> = {
	styleScript: toolbarStyleScript,
};
