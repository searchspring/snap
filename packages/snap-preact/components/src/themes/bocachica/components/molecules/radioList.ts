import { css } from '@emotion/react';
import type { RadioListProps } from '../../../../components/Molecules/RadioList';

// CSS in JS style script for the RadioList component
const radioListStyleScript = ({ theme }: RadioListProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__radio-list__options-wrapper': {
			border: 'none',
			listStyle: 'none',
			padding: '0px',
			margin: '0px',
		},

		'.ss__radio-list__title': {
			margin: '0px',
			padding: '5px',
		},

		'.ss__radio-list__option': {
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			padding: '5px',

			'& .ss__radio-list__option__label, .ss__radio-list__option__icon': {
				cursor: 'pointer',
				padding: '0px 0px 0px 5px',
			},
		},

		'&.ss__radio-list--disabled, .ss__radio-list__option--disabled': {
			cursor: 'none',
			pointerEvents: 'none',
			opacity: 0.5,
		},

		'.ss__radio-list__option--selected': {
			fontWeight: 'bold',
		},
	});
};

// RadioList component props
export const radioList: Partial<RadioListProps> = {
	themeStyleScript: radioListStyleScript,
};
