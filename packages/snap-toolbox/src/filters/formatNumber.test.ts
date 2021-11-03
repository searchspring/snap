import { formatNumber } from './formatNumber';

const input = 1199.999999;

describe('formatNumber', () => {
	it('returns nothing when a non number is provided', () => {
		//@ts-ignore
		let output = formatNumber('');
		expect(output).toBe(undefined);

		//@ts-ignore
		output = formatNumber('7');
		expect(output).toBe(undefined);

		output = formatNumber(Number.NaN);
		expect(output).toBe(undefined);
	});

	it('has default functionality', () => {
		const output = formatNumber(input);

		expect(output).toBe('1199.999');
	});

	it('displays negative numbers', () => {
		const output = formatNumber(input * -1);

		expect(output).toBe('-1199.999');
	});

	it('appends a symbol before input', () => {
		const output = formatNumber(input, {
			symbol: '*',
		});

		expect(output).toBe('*1199.999');
	});

	it('appends a symbol after input', () => {
		const output = formatNumber(input, {
			symbol: 'mm',
			symbolAfter: true,
		});

		expect(output).toBe('1199.999mm');
	});

	it('can remove decimal place', () => {
		const output = formatNumber(input, {
			decimalPlaces: 0,
		});

		expect(output).toBe('1199');
	});

	it('adds decimal places when none provided', () => {
		const output = formatNumber(100, {
			decimalPlaces: 2,
		});

		expect(output).toBe('100.00');
	});

	it('pads decimal places when places is larger than provided', () => {
		const output = formatNumber(100.1, {
			decimalPlaces: 3,
		});

		expect(output).toBe('100.100');
	});

	it('does not pad decimal places when specified', () => {
		const output = formatNumber(100.1, {
			decimalPlaces: 3,
			padDecimalPlaces: false,
		});

		expect(output).toBe('100.1');
	});

	it('can change decimal places', () => {
		const output = formatNumber(input, {
			decimalPlaces: 1,
		});

		expect(output).toBe('1199.9');

		const outputMorePrecise = formatNumber(input, {
			decimalPlaces: 6,
		});

		expect(outputMorePrecise).toBe('1199.999999');
	});

	it('can add thousands separator', () => {
		const output = formatNumber(input, {
			thousandsSeparator: ',',
		});

		expect(output).toBe('1,199.999');
	});

	it('can change decimal separator', () => {
		const output = formatNumber(input, {
			decimalSeparator: ',',
		});

		expect(output).toBe('1199,999');
	});

	it('can do all the things', () => {
		const output = formatNumber(input, {
			decimalSeparator: ',',
			thousandsSeparator: '_',
			decimalPlaces: 6,
			symbol: ' °C',
			symbolAfter: true,
		});

		expect(output).toBe('1_199,999999 °C');
	});

	it('can format as euro price', () => {
		const output = formatNumber(input, {
			decimalSeparator: ',',
			thousandsSeparator: '.',
			decimalPlaces: 2,
			symbol: ' £',
			symbolAfter: true,
		});

		expect(output).toBe('1.199,99 £');
	});
});
