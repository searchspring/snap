/*
	Colour Class - for shifting hex colors
	* requires hexadecimal color
	* can add transparency
	* can lighten and darken via shift

	red = new Colour('#ff0000');

	// get hex value
	const redHex = red.hex;

	// get rgb value
	const redRgb = red.rgb;

	// to lighten and make more transparent
	const lightAndClear = red.lighten(20).transparency(50).hex;

	// to darken and make opaque
	const lightAndClear = red.darken(20).opaque(50).hex;
*/

export class Colour {
	private value: string | undefined;
	private rgbValue: string | undefined;
	private hexValue: string | undefined;

	public get hex(): string | undefined {
		if (this.hexValue) {
			return this.hexValue;
		}

		return this.value;
	}

	public get rgb(): string | undefined {
		if (this.rgbValue) {
			return this.rgbValue;
		}

		return this.value;
	}

	constructor(value: string | undefined) {
		this.value = value;

		if (value) {
			if (Colour.isHex(value)) {
				// store hex value after verification
				this.hexValue = value;
				// store rgb value after transformation
				this.rgbValue = Colour.hexToRgb(value);
			} else if (Colour.isRgb(value)) {
				// store rgb after verification
				this.rgbValue = value;
				// store hex value after transformation
				this.hexValue = Colour.rgbToHex(value);
			}
		}
	}

	shift(offset: number): Colour {
		return new Colour(Colour.brightness(this.hex, offset));
	}

	lighten(offset: number): Colour {
		if (offset < 0) return this;
		return new Colour(Colour.brightness(this.hex, offset));
	}

	darken(offset: number): Colour {
		if (offset < 0) return this;
		return new Colour(Colour.brightness(this.hex, -offset));
	}

	opacity(offset: number): Colour {
		return new Colour(Colour.opacity(this.hex, offset));
	}

	transparency(offset: number): Colour {
		if (offset < 0) return this;
		return new Colour(Colour.opacity(this.hex, offset));
	}

	opaque(offset: number): Colour {
		if (offset < 0) return this;
		return new Colour(Colour.opacity(this.hex, -offset));
	}

	static isRgb(color: string): boolean {
		return Boolean(
			color.match(/^rgba?\([0-9]{1,3}[\s,\,]+[0-9]{1,3}[\s,\,]+[0-9]{1,3}[\s,\,]*\)$/i) ||
				color.match(/^rgba?\([0-9]{1,3}[\s,\,]+[0-9]{1,3}[\s,\,]+[0-9]{1,3}[\s,\,]+0?\.?[0-9]+%?[\s,\,]*\)$/i)
		);
	}

	static isHex(color: string): boolean {
		return Boolean(color.match(/^#[a,b,c,d,e,f,0-9]{6}$/i) || color.match(/^#[a,b,c,d,e,f,0-9]{8}$/i));
	}

	static hexToRgb(hex: string): string {
		if (!Colour.isHex(hex)) throw 'invalid hex supplied';

		const red = parseInt(hex.slice(1, 3), 16);
		const green = parseInt(hex.slice(3, 5), 16);
		const blue = parseInt(hex.slice(5, 7), 16);
		const alpha = parseInt(hex.slice(7, 9), 16);

		if (Number.isInteger(alpha)) {
			// convert alpha to fraction and round
			return `rgba(${red}, ${green}, ${blue}, ${round(alpha / 255)})`;
		}

		return `rgb(${red}, ${green}, ${blue})`;
	}

	static rgbToHex(rgb: string): string {
		if (!Colour.isRgb(rgb)) throw 'invalid rgb supplied';

		const [r, g, b, a] = (rgb.match(/[0-9]?\.?[0-9]+%?/g) || []).map((d, index) => {
			if (index == 3) {
				// handle alpha percentage
				if (d.match(/%/)) {
					d = (Number(d.replace('%', '').trim()) / 100).toString();
				}
				let fraction = Number(d);
				if (Number.isNaN(fraction) || fraction > 1) fraction = 1;
				if (fraction < 0) fraction = 0;
				d = Math.floor(fraction * 255).toString();
			}
			return Number(d).toString(16).padStart(2, '0');
		});

		return `#${r}${g}${b}${a ? a : ''}`;
	}

	static opacity(color: string | undefined, offset: number): string | undefined {
		let isRgb = false;
		if (color && Colour.isRgb(color)) {
			isRgb = true;
			color = Colour.rgbToHex(color);
		}
		if (!color || !Colour.isHex(color) || !Number.isInteger(offset)) return color;

		// normalize the offset
		if (offset > 255) offset = 255;
		if (offset < -255) offset = -255;

		const alpha = color.slice(7, 9) || 'ff';
		const alphaValue = parseInt(alpha, 16);

		let a = alphaValue - offset;

		if (a > 255) a = 255;
		else if (a < 0) a = 0;

		// padout with zeros to ensure 2 digit alpha
		const newAlpha = a.toString(16).padStart(2, '0');

		const hexValue = `${color.slice(0, 7) as string}${newAlpha}`;

		if (isRgb) {
			return Colour.hexToRgb(hexValue);
		}
		return hexValue;
	}

	static brightness(color: string | undefined, offset: number): string | undefined {
		let isRgb = false;
		if (color && Colour.isRgb(color)) {
			isRgb = true;
			color = Colour.rgbToHex(color);
		}
		if (!color || !Colour.isHex(color) || !Number.isInteger(offset)) return color;

		// normalize the offset
		if (offset > 255) offset = 255;
		if (offset < -255) offset = -255;

		// remove the # and ignore alpha characters
		const value = color.slice(1, 7);
		const num = parseInt(value, 16);

		let red = (num & 0x0000ff) + offset;
		if (red > 255) red = 255;
		else if (red < 0) red = 0;

		let green = ((num >> 8) & 0x00ff) + offset;
		if (green > 255) green = 255;
		else if (green < 0) green = 0;

		let blue = (num >> 16) + offset;
		if (blue > 255) blue = 255;
		else if (blue < 0) blue = 0;

		// padout with zeros to ensure 6 digits in conversion and tack on alpha characters
		const hexValue = `#${(red | (green << 8) | (blue << 16)).toString(16).padStart(6, '0')}${color.slice(7, 9)}`;

		if (isRgb) {
			return Colour.hexToRgb(hexValue);
		}
		return hexValue;
	}
}

function round(number: number): number {
	// rounding to the nearest hundredth (eg. 0.77)
	const flooredNumber = Math.floor(number);
	const decimal = number - flooredNumber;

	// no decimal, nothing else to do
	if (!decimal) return number;

	const tenths = Math.floor(decimal * 10) * 10;
	const hundredths = Math.round(number * 100 - tenths);
	return flooredNumber + (tenths + hundredths) / 100;
}
