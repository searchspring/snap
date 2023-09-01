import { css, ElementProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Element component
const elementStyleScript = ({ theme }: ElementProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		color: variables?.color?.secondary,
	});
};

// Element component props
export const element: Partial<ElementProps> = {
	styleScript: elementStyleScript,
};
