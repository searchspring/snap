export type formatNumberOptions = {
	symbol?: string;
	decimalPlaces?: number;
	padDecimalPlaces?: boolean;
	thousandsSeparator?: string;
	decimalSeparator?: string;
	symbolAfter?: boolean;
};

export function formatNumber(input: number, opts?: formatNumberOptions): string {
	const options = {
		symbol: '',
		decimalPlaces: 3,
		padDecimalPlaces: true,
		thousandsSeparator: '',
		decimalSeparator: '.',
		symbolAfter: false,
		...opts,
	};

	if (typeof input != 'number') {
		return input;
	}

	// format based on options
	const split = truncateDecimals(input, options.decimalPlaces).split('.');
	split[0] = split[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + options.thousandsSeparator);
	if (options.decimalPlaces > 0 && options.padDecimalPlaces) {
		split[1] = (split[1] || '').padEnd(options.decimalPlaces, '0');
	}

	let output = split.join(options.decimalSeparator);

	// if symbol should go after
	if (options.symbolAfter) {
		output = output + options.symbol;
	} else {
		output = options.symbol + output;
	}

	return output;
}

function truncateDecimals(input: string | number, digits: number): string {
	const numString = input.toString();
	const decimalPosition = numString.indexOf('.');
	const substrLength = decimalPosition == -1 ? numString.length : 1 + decimalPosition + (digits || -1);

	return numString.substr(0, substrLength);
}
