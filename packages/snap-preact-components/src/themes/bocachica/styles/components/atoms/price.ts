import { css, PriceProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Price component
const priceStyleScript = ({ theme }: PriceProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		color: theme?.colors?.primary,
		'&.ss__price--strike': {
			textDecoration: 'line-through',
			color: 'initial',
		},
	});
};

// Price component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-price--custom-currency
export const price: PriceProps = {
	styleScript: priceStyleScript,
};
