import { css } from '@emotion/react';
import type { ResultProps } from '../../../../components/Molecules/Result';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Result component
const resultStyleScript = ({ theme }: ResultProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__result__details': {
			'& .ss__result__details__pricing': {
				'& .ss__result__price': {
					color: variables?.colors.secondary,
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
