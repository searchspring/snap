import { h, Fragment } from 'preact';

import { filters } from '@searchspring/snap-toolbox';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { FormattedNumberProps } from '../FormattedNumber/FormattedNumber';
import { StyleScript } from '../../../types';
import { mergeProps, mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<PriceProps> = ({ theme }) => {
	return css({
		color: theme?.variables?.colors?.primary,
		'&.ss__price--strike': {
			textDecoration: 'line-through',
			color: 'initial',
		},
	});
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

	const { lineThrough, value, symbol, decimalPlaces, padDecimalPlaces, thousandsSeparator, decimalSeparator, symbolAfter, raw, className } = props;

	let formattedPrice: string | undefined;
	if (value) {
		formattedPrice = filters.currency(value, {
			symbol: '',
			decimalPlaces,
			padDecimalPlaces,
			thousandsSeparator,
			decimalSeparator,
		});
	}

	const styling = mergeStyles<PriceProps>(props, defaultStyles);

	if (formattedPrice) {
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
	} else {
		return <Fragment></Fragment>;
	}
}

export interface PriceProps extends Omit<FormattedNumberProps, 'value'> {
	value?: number;
	lineThrough?: boolean;
}
export type PriceNames = 'price' | 'price--msrp' | 'bundle-strike-price' | 'bundle-price';
