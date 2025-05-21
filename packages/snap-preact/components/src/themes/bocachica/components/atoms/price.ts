import { css } from '@emotion/react';
import type { PriceProps } from '../../../../components/Atoms/Price';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Price component
const priceStyleScript = ({ theme }: PriceProps) => {
	const variables = theme?.variables;

	return css({
		margin: '0 0.5rem 0 0',
		'&.ss__price--strike': {
			color: variables?.colors?.secondary || 'inherit',
			opacity: 0.5,
		},
	});
};

// Price component props
export const price: ThemeComponent<'price', PriceProps> = {
	default: {
		price: {
			themeStyleScript: priceStyleScript,
		},
	},
};
