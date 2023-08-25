/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import { filters } from '@searchspring/snap-toolbox';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

const CSS = {
	formattedNumber: ({}) => css({}),
};

export function FormattedNumber(properties: FormattedNumberProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps: Partial<FormattedNumberProps> = {
		symbol: '',
		decimalPlaces: 3,
		padDecimalPlaces: true,
		thousandsSeparator: '',
		decimalSeparator: '.',
		symbolAfter: true,
	};

	const props = mergeProps('formattedNumber', globalTheme, defaultProps, properties);

	const {
		value,
		symbol,
		decimalPlaces,
		padDecimalPlaces,
		thousandsSeparator,
		decimalSeparator,
		symbolAfter,
		disableStyles,
		className,
		style,
		raw,
		styleScript,
	} = props;

	const formattedNumber = filters.formatNumber(value, {
		symbol,
		decimalPlaces,
		padDecimalPlaces,
		thousandsSeparator,
		decimalSeparator,
		symbolAfter,
	});

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.formattedNumber(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return raw ? (
		<Fragment>{formattedNumber}</Fragment>
	) : (
		<CacheProvider>
			<span className={classnames('ss__formatted-number', className)} {...styling}>
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
