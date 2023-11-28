import { css, ErrorHandlerProps } from '../../../../../index';

import { LightenDarkenColor } from '../../../../../utilities';

// CSS in JS style script for the ErrorHandler component
const errorHandlerStyleScript = ({ theme }: ErrorHandlerProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		borderRadius: '2px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderLeft: '4px solid',
		'.ss__error-handler__message': {
			padding: '10px',
			display: 'flex',
			alignItems: 'center',

			'.ss__icon': {
				marginRight: '5px',
			},
		},

		'& .ss__error-handler__button': {
			backgroundColor: 'white',
			color: 'inherit',
			borderColor: 'black',
			width: ['150px', 'fit-content'],
			margin: '5px 10px',

			'.ss__icon': {
				marginRight: '5px',
			},
		},

		'&.ss__error-handler--error': {
			backgroundColor: LightenDarkenColor('red', 180),
			borderLeftColor: '#ff0000',
			'.ss__error-handler__message': {
				'.ss__icon': {
					fill: '#ff0000',
				},
			},
		},
		'&.ss__error-handler--warning': {
			backgroundColor: LightenDarkenColor('yellow', 180),
			borderLeftColor: '#ffff00',
			'.ss__icon': {
				fill: '#ffff00',
			},
			'.ss__error-handler__button': {
				borderColor: '#ffff00',
			},
		},
		'&.ss__error-handler--info': {
			backgroundColor: LightenDarkenColor('blue', 180),
			borderLeftColor: '#0000ff',
			'.ss__error-handler__message': {
				'.ss__icon': {
					fill: '#0000ff',
				},
			},
		},
	});
};

// ErrorHandler component props
export const errorHandler: Partial<ErrorHandlerProps> = {
	styleScript: errorHandlerStyleScript,
};
