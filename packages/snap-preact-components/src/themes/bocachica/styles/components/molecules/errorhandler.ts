import { css, ErrorHandlerProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';
import { LightenDarkenColor } from '../../../../../utilities';

// CSS in JS style script for the ErrorHandler component
const errorHandlerStyleScript = ({ theme }: ErrorHandlerProps) => {
	const variables = theme?.variables as BocachicaVariables;

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
			borderColor: variables?.color?.primary,
			width: ['150px', 'fit-content'],
			margin: '5px 10px',

			'.ss__icon': {
				marginRight: '5px',
			},
		},

		'&.ss__error-handler--error': {
			backgroundColor: LightenDarkenColor(variables?.color?.message?.error || 'red', 180),
			borderLeftColor: variables?.color?.message?.error || '#ff0000',
			'.ss__error-handler__message': {
				'.ss__icon': {
					fill: variables?.color?.message?.error || '#ff0000',
				},
			},
		},
		'&.ss__error-handler--warning': {
			backgroundColor: LightenDarkenColor(variables?.color?.message?.warning || 'yellow', 180),
			borderLeftColor: variables?.color?.message?.warning || '#ffff00',
			'.ss__icon': {
				fill: variables?.color?.message?.warning || '#ffff00',
			},
			'.ss__error-handler__button': {
				borderColor: variables?.color?.message?.warning || '#ffff00',
			},
		},
		'&.ss__error-handler--info': {
			backgroundColor: LightenDarkenColor(variables?.color?.message?.info || 'blue', 180),
			borderLeftColor: variables?.color?.message?.info || '#0000ff',
			'.ss__error-handler__message': {
				'.ss__icon': {
					fill: variables?.color?.message?.info || '#0000ff',
				},
			},
		},
	});
};

// ErrorHandler component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-errorhandler--custom-error
export const errorHandler: ErrorHandlerProps = {
	styleScript: errorHandlerStyleScript,
};
