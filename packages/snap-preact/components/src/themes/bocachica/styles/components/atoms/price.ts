import { css, PriceProps } from '../../../../../index';

// CSS in JS style script for the Price component
const priceStyleScript = ({ theme }: PriceProps) => {
	const variables = theme?.variables;

	return css({
		color: variables?.color?.secondary,
		margin: '0 0.5rem 0 0',

		'&.ss__price--strike': {
			textDecoration: 'line-through',
			color: variables?.color?.secondary || 'inherit',
			opacity: 0.5,
		},
	});
};

// Price component props
export const price: Partial<PriceProps> = {
	styleScript: priceStyleScript,
};
