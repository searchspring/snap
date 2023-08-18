import { css, FormattedNumberProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FormattedNumber component
const formattedNumberStyleScript = ({ theme }: FormattedNumberProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({});
};

// FormattedNumber component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-formattednumber--default
export const formattedNumber: Omit<FormattedNumberProps, 'value'> = {
	styleScript: formattedNumberStyleScript,
};
