import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import { filters } from '@searchspring/snap-toolbox';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeProps, mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<FormattedNumberProps> = () => {
	return css({});
};

export function FormattedNumber(properties: FormattedNumberProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<FormattedNumberProps> = {
		symbol: '',
		decimalPlaces: 3,
		padDecimalPlaces: true,
		thousandsSeparator: '',
		decimalSeparator: '.',
		symbolAfter: true,
		treePath: globalTreePath,
	};

	const props = mergeProps('formattedNumber', globalTheme, defaultProps, properties);

	const { value, symbol, decimalPlaces, padDecimalPlaces, thousandsSeparator, decimalSeparator, symbolAfter, className, internalClassName, raw } =
		props;

	const formattedNumber = filters.formatNumber(value, {
		symbol,
		decimalPlaces,
		padDecimalPlaces,
		thousandsSeparator,
		decimalSeparator,
		symbolAfter,
	});

	const styling = mergeStyles<FormattedNumberProps>(props, defaultStyles);

	return raw ? (
		<Fragment>{formattedNumber}</Fragment>
	) : (
		<CacheProvider>
			<span className={classnames('ss__formatted-number', className, internalClassName)} {...styling}>
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
