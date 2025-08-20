import { css } from '@emotion/react';
import { ThemeComponent } from '../../../../providers';
import { ModalProps } from '../../../../components/Molecules/Modal';

// CSS in JS style script for the Modal component
const modalStyleScript = ({}: ModalProps) => {
	return css({});
};

// Modal component props
export const modal: ThemeComponent<'modal', ModalProps> = {
	default: {
		modal: {
			themeStyleScript: modalStyleScript,
		},
	},
};
