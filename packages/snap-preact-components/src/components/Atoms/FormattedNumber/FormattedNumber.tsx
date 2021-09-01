/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import { filters } from '@searchspring/snap-toolbox';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';

const CSS = {
	formattedNumber: () => css({}),
};

export function FormattedNumber(properties: FormattedNumberProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: FormattedNumberProps = {
		// default props
		symbol: '',
		decimalPlaces: 3,
		padDecimalPlaces: true,
		thousandsSeparator: '',
		decimalSeparator: '.',
		symbolAfter: true,
		// global theme
		...globalTheme?.components?.formattedNumber,
		// props
		...properties,
		...properties.theme?.components?.formattedNumber,
	};

	const { value, symbol, decimalPlaces, padDecimalPlaces, thousandsSeparator, decimalSeparator, symbolAfter, disableStyles, className, style, raw } =
		props;

	const formattedNumber = filters.formatNumber(value, {
		symbol,
		decimalPlaces,
		padDecimalPlaces,
		thousandsSeparator,
		decimalSeparator,
		symbolAfter,
	});

	return raw ? (
		<>{formattedNumber}</>
	) : (
		<CacheProvider>
			<span className={classnames('ss__formatted-number', className)} css={!disableStyles ? [CSS.formattedNumber(), style] : [style]}>
				{formattedNumber}
			</span>
		</CacheProvider>
	);
}
export interface FormattedNumberProps extends ComponentProps {
	value: number;
	symbol?: string;
	decimalPlaces?: number;
	padDecimalPlaces?: boolean;
	thousandsSeparator?: string;
	decimalSeparator?: string;
	symbolAfter?: boolean;
	raw?: boolean;
}
