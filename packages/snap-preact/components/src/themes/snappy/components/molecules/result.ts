import { css } from '@emotion/react';
import type { ResultProps } from '../../../../components/Molecules/Result';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Result component
const resultStyleScript = ({ theme }: ResultProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'&.ss__result--list': {
			border: '1px solid #e6e6e6',
			borderRadius: '20px',
			overflow: 'hidden',
			'& .ss__result__details': {
				flexDirection: 'row',
				display: 'flex',
				justifyContent: 'space-between',
				padding: '10px',
				marginLeft: '0px',
				position: 'relative',

				'.ss__result__details__pricing': {
					marginBottom: '0px',
					display: 'flex',
					alignItems: 'center',

					'.ss__result__price': {
						fontSize: '2em',
					},
					'.ss__price--strike': {
						fontSize: '1.2em',
					},
				},

				'& .ss__callout-badge': {
					position: 'absolute',
					bottom: '0px',
				},
			},

			'.ss__result__image-wrapper': {
				flex: '0 0 6%',
				'.ss__result__image': {
					borderRadius: '0px',
				},
			},
		},
		'&.ss__result--grid': {
			position: 'relative',

			'& .ss__result__details': {
				// width: 'calc(100% - 20px)',
				width: '100%',
				boxSizing: 'border-box',
				height: '-webkit-fill-available',
				textAlign: 'left',
				// background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 100%)',
				background: ' linear-gradient(to bottom,  rgba(0,0,0,0) 51%,rgba(0,0,0,0.65) 100%)',
				cursor: 'pointer',
				position: 'absolute',
				borderRadius: '20px',
				color: 'white',
				alignItems: 'baseline',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',

				'& .ss__result__details__title': {
					a: {
						color: 'inherit',
						textDecoration: 'none',
					},
				},
				'& .ss__result__details__pricing': {
					'& .ss__result__price': {
						color: 'white',
						fontSize: '1.5em',
					},
					'& .ss__price--strike': {
						fontSize: '1.2em',
						opacity: 0.7,
					},
				},
			},
		},

		[`@media (max-width: ${variables?.breakpoints.mobile}px)`]: {
			'&.ss__result--list': {
				'.ss__result__image-wrapper': {
					flex: '0 0 20%',
				},
				'& .ss__result__details': {
					'.ss__result__details__pricing': {
						'.ss__result__price': {
							fontSize: '1.3em',
						},
						'.ss__price--strike': {
							fontSize: '.9em',
						},
					},
				},
			},
		},
	});
};

// Result component props
export const result: ThemeComponent<'result', ResultProps> = {
	default: {
		props: {
			themeStyleScript: resultStyleScript,
		},
	},
};
