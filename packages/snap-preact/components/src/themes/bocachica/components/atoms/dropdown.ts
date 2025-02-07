import { css } from '@emotion/react';
import type { DropdownProps } from '../../../../components/Atoms/Dropdown';

// CSS in JS style script for the Dropdown component
const dropdownStyleScript = ({ theme }: DropdownProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		position: 'relative',
		'&.ss__dropdown--open': {
			'& .ss__dropdown__content': {
				transition: `opacity .5s ease`,
			},
		},
	});
};

// Dropdown component props
export const dropdown: Partial<DropdownProps> = {
	themeStyleScript: dropdownStyleScript,
};
