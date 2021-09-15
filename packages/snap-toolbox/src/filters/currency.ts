import { formatNumber, formatNumberOptions } from './formatNumber';

export function currency(input: number, opts?: formatNumberOptions): string | undefined {
	const defaultOptions = {
		symbol: '$',
		thousandsSeparator: ',',
		decimalPlaces: 2,
		...opts,
	};

	return formatNumber(input, defaultOptions);
}
