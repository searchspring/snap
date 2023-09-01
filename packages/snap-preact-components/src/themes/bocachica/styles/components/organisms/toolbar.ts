import { css, ToolbarProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = ({ theme }: ToolbarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({});
};

// Toolbar component props
export const toolbar: Partial<ToolbarProps> = {
	styleScript: toolbarStyleScript,
};
