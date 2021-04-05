/** @jsx jsx */
import { h } from 'preact';

import { filters } from '@searchspring/snap-toolbox';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme } from '../../../providers/theme';
import { FormattedNumberProps } from '../FormattedNumber/FormattedNumber';

const CSS = {
	price: ({ style }) =>
		css({
			'&.ss-strike': {
				textDecoration: 'line-through',
			},
			...style,
		}),
};

export function Price(properties: PriceProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: PriceProps = {
		// default props
		symbol: '$',
		decimalPlaces: 2,
		thousandsSeparator: ',',
		decimalSeparator: '.',
		symbolAfter: false,
		// global theme
		...globalTheme?.components?.price,
		// props
		...properties,
		...properties.theme?.components?.price,
	};

	const { lineThrough, value, symbol, decimalPlaces, thousandsSeparator, decimalSeparator, symbolAfter, disableStyles, className, style } = props;

	const formattedPrice = filters.currency(value, {
		symbol,
		decimalPlaces,
		thousandsSeparator,
		decimalSeparator,
		symbolAfter,
	});

	return (
		<span css={!disableStyles && CSS.price({ style })} className={classnames('ss-price', { 'ss-strike': lineThrough }, className)}>
			{formattedPrice}
		</span>
	);
}

export interface PriceProps extends FormattedNumberProps {
	lineThrough?: boolean;
}
