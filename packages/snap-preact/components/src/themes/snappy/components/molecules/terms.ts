import { css } from '@emotion/react';
import type { TermsProps } from '../../../../components/Molecules/Terms';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Terms component
const termsStyleScript = ({ theme }: TermsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__terms__options .ss__terms__option': {
			border: '1px solid black',
			borderRadius: '28px',
			textAlign: 'center',
			padding: '5px 15px',
		},
		'& .ss__terms__options': {
			gap: '5px',
			flexDirection: 'row',
			justifyContent: 'space-evenly',
		},
	});
};

// Terms component props
export const terms: ThemeComponent<'terms', TermsProps> = {
	default: {
		terms: {
			themeStyleScript: termsStyleScript,
		},
	},
};
