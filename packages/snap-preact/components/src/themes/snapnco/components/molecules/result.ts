import { css } from '@emotion/react';
import type { ResultProps } from '../../../../components/Molecules/Result';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Result component
const resultStyleScript = ({ theme }: ResultProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__result__details': {
			textAlign: 'left',
			fontWeight: 'bold',

			'& .ss__result__details__pricing': {
				display: 'flex',
				'& .ss__result__price': {
					fontSize: '1.2em',
				},
				'& .ss__price--strike': {
					fontSize: '1.2em',
					order: 2,
					padding: '0px 8px',
				},
			},
		},
	});
};

// Result component props
export const result: ThemeComponent<'result', ResultProps> = {
	default: {
		result: {
			themeStyleScript: resultStyleScript,
		},
	},
};
