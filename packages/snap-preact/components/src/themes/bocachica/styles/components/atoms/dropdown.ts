import { css, DropdownProps } from '../../../../../index';

// CSS in JS style script for the Dropdown component
const dropdownStyleScript = ({ disableOverlay, theme }: DropdownProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

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
			boxSizing: 'border-box',
			background: '#fff',
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
export const dropdown: Partial<DropdownProps> = {
	styleScript: dropdownStyleScript,
};
