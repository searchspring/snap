import { css, ResultProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Result component
const resultStyleScript = ({ theme }: ResultProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'&.ss__result--grid': {
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			'& .ss__result__image-wrapper': {
				flex: '1 0 auto',
				minHeight: '0%',
			},
		},
		'&.ss__result--list': {
			display: 'flex',
			flexDirection: 'row',
			'& .ss__result__image-wrapper': {
				flex: '0 0 33%',
			},
			'& .ss__result__details': {
				flex: '1 1 auto',
				textAlign: 'left',
				marginLeft: '20px',
				padding: 0,
			},
		},

		'& .ss__result__image-wrapper': {
			position: 'relative',
			'& .ss__result__badge': {
				background: 'rgba(255, 255, 255, 0.5)',
				padding: '10px',
			},
		},

		'& .ss__result__details': {
			padding: '10px',
			textAlign: 'center',

			'& .ss__result__details__title': {
				marginBottom: '10px',
			},
			'& .ss__result__details__pricing': {
				marginBottom: '10px',

				'& .ss__result__price': {
					fontSize: '1.2em',
				},
				'& .ss__price--strike': {
					fontSize: '80%',
				},
			},
			'& .ss__result__details__button': {
				marginBottom: '10px',
			},
		},
	});
};

// Result component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-result--default
export const result: Omit<ResultProps, 'result'> = {
	styleScript: resultStyleScript,
};
