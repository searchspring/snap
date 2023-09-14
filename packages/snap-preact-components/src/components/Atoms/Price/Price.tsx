/** @jsx jsx */
import { h, Fragment } from 'preact';

import { filters } from '@searchspring/snap-toolbox';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { FormattedNumberProps } from '../FormattedNumber/FormattedNumber';
import { StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

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
	const defaultProps: Partial<PriceProps> = {
		symbol: '$',
		decimalPlaces: 2,
		padDecimalPlaces: true,
		thousandsSeparator: ',',
		decimalSeparator: '.',
		symbolAfter: false,
		lineThrough: false,
	};

	const props = mergeProps('price', globalTheme, defaultProps, properties);

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
		styleScript,
	} = props;

	let formattedPrice: string | undefined;
	if (value) {
		formattedPrice = filters.currency(value, {
			symbol,
			decimalPlaces,
			padDecimalPlaces,
			thousandsSeparator,
			decimalSeparator,
			symbolAfter,
		});
	}

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.price(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}
	if (formattedPrice) {
		return raw ? (
			<Fragment>{formattedPrice}</Fragment>
		) : (
			<CacheProvider>
				<span {...styling} className={classnames('ss__price', { 'ss__price--strike': lineThrough }, className)}>
					{formattedPrice}
				</span>
			</CacheProvider>
		);
	} else {
		return <Fragment></Fragment>;
	}
}

export interface PriceProps extends Omit<FormattedNumberProps, 'value'> {
	value?: number;
	lineThrough?: boolean;
}
