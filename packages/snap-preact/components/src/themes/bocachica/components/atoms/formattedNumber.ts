import { css } from '@emotion/react';
import type { FormattedNumberProps } from '../../../../components/Atoms/FormattedNumber';

// CSS in JS style script for the FormattedNumber component
const formattedNumberStyleScript = ({ theme }: FormattedNumberProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// FormattedNumber component props
export const formattedNumber: Partial<FormattedNumberProps> = {
	styleScript: formattedNumberStyleScript,
};
