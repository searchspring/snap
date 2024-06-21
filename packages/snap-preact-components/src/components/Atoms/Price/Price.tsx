/** @jsx jsx */
import { h, Fragment } from 'preact';

import { filters } from '@searchspring/snap-toolbox';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { FormattedNumberProps } from '../FormattedNumber/FormattedNumber';
import { StylingCSS } from '../../../types';

const CSS = {
	price: ({ theme }: Partial<PriceProps>) =>
		css({
			color: theme?.colors?.primary,
			'&.ss__price--strike': {
				textDecoration: 'line-through',
				color: 'initial',
			},
		}),
};

export function Price(properties: PriceProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: PriceProps = {
		// default props
		symbol: '$',
		decimalPlaces: 2,
		padDecimalPlaces: true,
		thousandsSeparator: ',',
		decimalSeparator: '.',
		symbolAfter: false,
		lineThrough: false,
		// global theme
		...globalTheme?.components?.price,
		// props
		...properties,
		...properties.theme?.components?.price,
	};

	const {
		lineThrough,
		value,
		symbol,
		decimalPlaces,
		padDecimalPlaces,
		thousandsSeparator,
		decimalSeparator,
		symbolAfter,
		raw,
		disableStyles,
		className,
		style,
	} = props;

	const formattedPrice = filters.currency(+value, {
		symbol: '',
		decimalPlaces,
		padDecimalPlaces,
		thousandsSeparator,
		decimalSeparator,
	});

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.price({ theme }), style];
	} else if (style) {
		styling.css = [style];
	}

	return raw ? (
		<Fragment>{formattedPrice}</Fragment>
	) : (
		<CacheProvider>
			<span {...styling} className={classnames('ss__price', { 'ss__price--strike': lineThrough }, className)}>
				{symbol && !symbolAfter ? <span className={'ss__price__symbol'}>{symbol}</span> : <></>}
				<span className={'ss__price__value'}>{formattedPrice}</span>
				{symbol && symbolAfter ? <span className={'ss__price__symbol'}>{symbol}</span> : <></>}
			</span>
		</CacheProvider>
	);
}

export interface PriceProps extends FormattedNumberProps {
	lineThrough?: boolean;
}
