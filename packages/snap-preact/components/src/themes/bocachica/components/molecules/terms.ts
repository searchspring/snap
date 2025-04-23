import { css } from '@emotion/react';
import type { TermsProps } from '../../../../components/Molecules/Terms';

// CSS in JS style script for the Terms component
const termsStyleScript = ({ theme }: TermsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Terms component props
export const terms: ThemeComponentProps<TermsProps> = {
	default: {
		styleScript: termsStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
