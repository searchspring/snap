import { css } from '@emotion/react';
import type { ResultsProps } from '../../../../../components/Organisms/Results';

// CSS in JS style script for the Results component
const resultsStyleScript = ({ columns, gapSize, theme }: ResultsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gap: gapSize,
		gridTemplateRows: 'auto',
		gridTemplateColumns: `repeat(${columns}, 1fr)`,

		'& .ss__result, & .ss__result-layout': {
			boxSizing: 'border-box',
			flex: '0 1 auto',
			width: `calc(${100 / columns!}% - (${columns! - 1} * ${gapSize} / ${columns} ) )`,
			marginRight: gapSize,
			marginBottom: gapSize,

			[`&:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},
			[`&:nth-last-of-type(-n+${columns})`]: {
				marginBottom: '0',
			},
		},
		'@supports (display: grid)': {
			display: 'grid',

			'& .ss__result, & .ss__result-layout': {
				width: 'initial',
				flex: undefined,
				margin: 0,
			},
		},
	});
};

// Results component props
export const results: Partial<ResultsProps> = {
	styleScript: resultsStyleScript,
};
