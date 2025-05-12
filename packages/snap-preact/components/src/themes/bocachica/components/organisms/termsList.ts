import { css } from '@emotion/react';
import type { TermsListProps } from '../../../../components/Organisms/TermsList';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Terms component
const termsListStyleScript = ({ theme }: TermsListProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// TermsList component props
export const termsList: ThemeComponent<'termsList', TermsListProps> = {
	default: {
		props: {
			styleScript: termsListStyleScript,
		},
	},
};
