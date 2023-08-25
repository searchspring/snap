import { css, DropdownProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Dropdown component
const dropdownStyleScript = ({ disableOverlay, theme }: DropdownProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		position: 'relative',
		'&.ss__dropdown--open': {
			'& .ss__dropdown__content': {
				transition: `opacity .5s ease`,
				position: disableOverlay ? 'relative' : undefined,
				visibility: 'visible',
				opacity: 1,
			},
		},
		'.ss__dropdown__button': {
			cursor: `${disableOverlay ? 'default' : 'pointer'}`,
		},
		'.ss__dropdown__content': {
			position: 'absolute',
			minWidth: '100%',
			visibility: 'hidden',
			opacity: 0,
			top: 'auto',
			left: 0,
		},
	});
};

// Dropdown component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-dropdown--default
export const dropdown: Omit<DropdownProps, 'button'> = {
	styleScript: dropdownStyleScript,
};
