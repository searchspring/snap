import { css, PriceProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Price component
const priceStyleScript = ({ theme }: PriceProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		color: variables?.color?.primary,
		'&.ss__price--strike': {
			textDecoration: 'line-through',
			color: variables?.color?.text || 'inherit',
		},
	});
};

// Price component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-price--custom-currency
export const price: PriceProps = {
	styleScript: priceStyleScript,
};
