import { css } from '@emotion/react';
import type { SwatchesProps } from '../../../../components/Molecules/Swatches';

// CSS in JS style script for the Swatches component
const swatchesStyleScript = ({ theme }: Partial<SwatchesProps>) => {
	return css({
		marginTop: '10px',
		'.ss__swatches__carousel__swatch': {
			boxSizing: 'content-box',
			cursor: 'pointer',
			backgroundRepeat: 'no-repeat',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			border: `1px solid ${theme?.variables?.colors?.primary || '#333'}`,
			aspectRatio: '1/1',
			margin: 'auto',
			flexDirection: 'column',

			'&.ss__swatches__carousel__swatch--selected': {
				border: `2px solid ${theme?.variables?.colors?.primary || '#333'}`,
			},

			'&.ss__swatches__carousel__swatch--disabled:before, &.ss__swatches__carousel__swatch--unavailable:before': {
				content: '""',
				display: 'block',
				position: 'absolute',
				top: '50%',
				width: '90%',
				height: '1px',
				borderTop: '3px solid #eee',
				outline: '1px solid #ffff',
				transform: 'rotate(-45deg)',
			},

			'&.ss__swatches__carousel__swatch--disabled': {
				position: 'relative',
				cursor: 'none',
				pointerEvents: 'none',
				opacity: 0.5,
			},

			'&.ss__swatches__carousel__swatch--unavailable': {
				cursor: 'pointer',
				opacity: 0.5,
			},
		},
	});
};

// Swatches component props
export const swatches: Partial<SwatchesProps> = {
	themeStyleScript: swatchesStyleScript,
};
