import { Colour } from './Colour';

describe('Color class', () => {
	it('will return provided invalid hex and rgb values when provided', () => {
		expect(new Colour('green').hex).toBe('green');
		expect(new Colour('green').rgb).toBe('green');
		expect(new Colour('#nope').hex).toBe('#nope');
		expect(new Colour('#nope').rgb).toBe('#nope');
		expect(new Colour('rgb(0)').hex).toBe('rgb(0)');
		expect(new Colour('rgb(0)').rgb).toBe('rgb(0)');
		expect(new Colour('rgb(58, 35)').rgb).toBe('rgb(58, 35)');
		expect(new Colour('rgba(58, 35, 173, 0.)').hex).toBe('rgba(58, 35, 173, 0.)');
	});

	it('supports hex and rgb values at construction', () => {
		expect(new Colour('#3a23ad').hex).toBe('#3a23ad');
		expect(new Colour('#3a23ad').rgb).toBe('rgb(58, 35, 173)');
		expect(new Colour('#3a23ad33').hex).toBe('#3a23ad33');
		expect(new Colour('#3a23ad33').rgb).toBe('rgba(58, 35, 173, 0.2)');

		expect(new Colour('rgb(58, 35, 173)').hex).toBe('#3a23ad');
		expect(new Colour('rgb(58, 35, 173)').rgb).toBe('rgb(58, 35, 173)');
		expect(new Colour('rgb(58, 35, 173, 70)').hex).toBe('#3a23adff');
		expect(new Colour('rgb(58, 35, 173, 70)').rgb).toBe('rgb(58, 35, 173, 70)');
		expect(new Colour('rgb(58, 35, 173, 0.5)').hex).toBe('#3a23ad7f');
		expect(new Colour('rgb(58, 35, 173, 0.5)').rgb).toBe('rgb(58, 35, 173, 0.5)');
		expect(new Colour('rgb(58, 35, 173, 50%)').hex).toBe('#3a23ad7f');
		expect(new Colour('rgb(58, 35, 173, 50%)').rgb).toBe('rgb(58, 35, 173, 50%)');

		expect(new Colour('rgba(58, 35, 173)').hex).toBe('#3a23ad');
		expect(new Colour('rgba(58, 35, 173)').rgb).toBe('rgba(58, 35, 173)');
		expect(new Colour('rgba(58, 35, 173, 70)').hex).toBe('#3a23adff');
		expect(new Colour('rgba(58, 35, 173, 70)').rgb).toBe('rgba(58, 35, 173, 70)');
		expect(new Colour('rgba(58, 35, 173, 0.5)').hex).toBe('#3a23ad7f');
		expect(new Colour('rgba(58, 35, 173, 0.5)').rgb).toBe('rgba(58, 35, 173, 0.5)');
		expect(new Colour('rgba(58, 35, 173, 50%)').hex).toBe('#3a23ad7f');
		expect(new Colour('rgba(58, 35, 173, 50%)').rgb).toBe('rgba(58, 35, 173, 50%)');
	});

	it('can shift color', () => {
		const red = new Colour('#ff0000');
		expect(red.shift(255).hex).toBe('#ffffff');
		expect(red.shift(240).hex).toBe('#fff0f0');
		expect(red.shift(210).hex).toBe('#ffd2d2');
		expect(red.shift(180).hex).toBe('#ffb4b4');
		expect(red.shift(150).hex).toBe('#ff9696');
		expect(red.shift(120).hex).toBe('#ff7878');
		expect(red.shift(90).hex).toBe('#ff5a5a');
		expect(red.shift(60).hex).toBe('#ff3c3c');
		expect(red.shift(30).hex).toBe('#ff1e1e');
		expect(red.shift(0).hex).toBe('#ff0000');
		expect(red.shift(-30).hex).toBe('#e10000');
		expect(red.shift(-60).hex).toBe('#c30000');
		expect(red.shift(-90).hex).toBe('#a50000');
		expect(red.shift(-120).hex).toBe('#870000');
		expect(red.shift(-150).hex).toBe('#690000');
		expect(red.shift(-180).hex).toBe('#4b0000');
		expect(red.shift(-210).hex).toBe('#2d0000');
		expect(red.shift(-240).hex).toBe('#0f0000');
		expect(red.shift(-255).hex).toBe('#000000');

		expect(red.shift(255).rgb).toBe('rgb(255, 255, 255)');
		expect(red.shift(240).rgb).toBe('rgb(255, 240, 240)');
		expect(red.shift(210).rgb).toBe('rgb(255, 210, 210)');
		expect(red.shift(180).rgb).toBe('rgb(255, 180, 180)');
		expect(red.shift(150).rgb).toBe('rgb(255, 150, 150)');
		expect(red.shift(120).rgb).toBe('rgb(255, 120, 120)');
		expect(red.shift(90).rgb).toBe('rgb(255, 90, 90)');
		expect(red.shift(60).rgb).toBe('rgb(255, 60, 60)');
		expect(red.shift(30).rgb).toBe('rgb(255, 30, 30)');
		expect(red.shift(0).rgb).toBe('rgb(255, 0, 0)');
		expect(red.shift(-30).rgb).toBe('rgb(225, 0, 0)');
		expect(red.shift(-60).rgb).toBe('rgb(195, 0, 0)');
		expect(red.shift(-90).rgb).toBe('rgb(165, 0, 0)');
		expect(red.shift(-120).rgb).toBe('rgb(135, 0, 0)');
		expect(red.shift(-150).rgb).toBe('rgb(105, 0, 0)');
		expect(red.shift(-180).rgb).toBe('rgb(75, 0, 0)');
		expect(red.shift(-210).rgb).toBe('rgb(45, 0, 0)');
		expect(red.shift(-240).rgb).toBe('rgb(15, 0, 0)');
		expect(red.shift(-255).rgb).toBe('rgb(0, 0, 0)');
	});

	it('can lighten color', () => {
		const red = new Colour('#ff0000');
		expect(red.lighten(0).hex).toBe('#ff0000');
		expect(red.lighten(30).hex).toBe('#ff1e1e');
		expect(red.lighten(60).hex).toBe('#ff3c3c');
		expect(red.lighten(90).hex).toBe('#ff5a5a');
		expect(red.lighten(120).hex).toBe('#ff7878');
		expect(red.lighten(150).hex).toBe('#ff9696');
		expect(red.lighten(180).hex).toBe('#ffb4b4');
		expect(red.lighten(210).hex).toBe('#ffd2d2');
		expect(red.lighten(240).hex).toBe('#fff0f0');
		expect(red.lighten(255).hex).toBe('#ffffff');
	});

	it('will not lighten if offset is less than zero', () => {
		const red = new Colour('#ff0000');
		expect(red.lighten(-50).hex).toBe('#ff0000');
	});

	it('can darken color', () => {
		const red = new Colour('#ff0000');
		expect(red.darken(0).hex).toBe('#ff0000');
		expect(red.darken(30).hex).toBe('#e10000');
		expect(red.darken(60).hex).toBe('#c30000');
		expect(red.darken(90).hex).toBe('#a50000');
		expect(red.darken(120).hex).toBe('#870000');
		expect(red.darken(150).hex).toBe('#690000');
		expect(red.darken(180).hex).toBe('#4b0000');
		expect(red.darken(210).hex).toBe('#2d0000');
		expect(red.darken(240).hex).toBe('#0f0000');
		expect(red.darken(255).hex).toBe('#000000');
	});

	it('will not darken if offset is less than zero', () => {
		const red = new Colour('#ff0000');
		expect(red.darken(-50).hex).toBe('#ff0000');
	});

	it('can change transparency', () => {
		const red = new Colour('#ff0000');
		expect(red.opacity(255).hex).toBe('#ff000000');
		expect(red.opacity(120).hex).toBe('#ff000087');
		expect(red.opacity(60).hex).toBe('#ff0000c3');
		expect(red.opacity(0).hex).toBe('#ff0000ff');
		expect(red.opacity(-60).hex).toBe('#ff0000ff');
		expect(red.opacity(-120).hex).toBe('#ff0000ff');
		expect(red.opacity(-255).hex).toBe('#ff0000ff');

		const transparentRed = new Colour('#ff000000');
		expect(transparentRed.opacity(255).hex).toBe('#ff000000');
		expect(transparentRed.opacity(120).hex).toBe('#ff000000');
		expect(transparentRed.opacity(60).hex).toBe('#ff000000');
		expect(transparentRed.opacity(0).hex).toBe('#ff000000');
		expect(transparentRed.opacity(-60).hex).toBe('#ff00003c');
		expect(transparentRed.opacity(-120).hex).toBe('#ff000078');
		expect(transparentRed.opacity(-255).hex).toBe('#ff0000ff');

		const translucentRed = new Colour('#ff000088');
		expect(translucentRed.opacity(255).hex).toBe('#ff000000');
		expect(translucentRed.opacity(120).hex).toBe('#ff000010');
		expect(translucentRed.opacity(60).hex).toBe('#ff00004c');
		expect(translucentRed.opacity(0).hex).toBe('#ff000088');
		expect(translucentRed.opacity(-60).hex).toBe('#ff0000c4');
		expect(translucentRed.opacity(-120).hex).toBe('#ff0000ff');
		expect(translucentRed.opacity(-255).hex).toBe('#ff0000ff');

		const opaqueRed = new Colour('#ff0000ff');
		expect(opaqueRed.opacity(255).hex).toBe('#ff000000');
		expect(opaqueRed.opacity(120).hex).toBe('#ff000087');
		expect(opaqueRed.opacity(60).hex).toBe('#ff0000c3');
		expect(opaqueRed.opacity(0).hex).toBe('#ff0000ff');
		expect(opaqueRed.opacity(-60).hex).toBe('#ff0000ff');
		expect(opaqueRed.opacity(-120).hex).toBe('#ff0000ff');
		expect(opaqueRed.opacity(-255).hex).toBe('#ff0000ff');
	});

	it('can make more transparent', () => {
		const red = new Colour('#ff0000');
		expect(red.transparency(0).hex).toBe('#ff0000ff');
		expect(red.transparency(60).hex).toBe('#ff0000c3');
		expect(red.transparency(120).hex).toBe('#ff000087');
		expect(red.transparency(255).hex).toBe('#ff000000');

		const transparentRed = new Colour('#ff000000');
		expect(transparentRed.transparency(0).hex).toBe('#ff000000');
		expect(transparentRed.transparency(60).hex).toBe('#ff000000');
		expect(transparentRed.transparency(120).hex).toBe('#ff000000');
		expect(transparentRed.transparency(255).hex).toBe('#ff000000');

		const translucentRed = new Colour('#ff000088');
		expect(translucentRed.transparency(0).hex).toBe('#ff000088');
		expect(translucentRed.transparency(60).hex).toBe('#ff00004c');
		expect(translucentRed.transparency(120).hex).toBe('#ff000010');
		expect(translucentRed.transparency(255).hex).toBe('#ff000000');

		const opaqueRed = new Colour('#ff0000ff');
		expect(opaqueRed.transparency(0).hex).toBe('#ff0000ff');
		expect(opaqueRed.transparency(60).hex).toBe('#ff0000c3');
		expect(opaqueRed.transparency(120).hex).toBe('#ff000087');
		expect(opaqueRed.transparency(255).hex).toBe('#ff000000');
	});

	it('will not make more transparent if offset is less than zero', () => {
		const red = new Colour('#ff0000ff');
		expect(red.transparency(-50).hex).toBe('#ff0000ff');
	});

	it('can make less transparency', () => {
		const red = new Colour('#ff0000');
		expect(red.opaque(0).hex).toBe('#ff0000ff');
		expect(red.opaque(60).hex).toBe('#ff0000ff');
		expect(red.opaque(120).hex).toBe('#ff0000ff');
		expect(red.opaque(255).hex).toBe('#ff0000ff');

		const transparentRed = new Colour('#ff000000');
		expect(transparentRed.opaque(0).hex).toBe('#ff000000');
		expect(transparentRed.opaque(60).hex).toBe('#ff00003c');
		expect(transparentRed.opaque(120).hex).toBe('#ff000078');
		expect(transparentRed.opaque(255).hex).toBe('#ff0000ff');

		const translucentRed = new Colour('#ff000088');
		expect(translucentRed.opaque(0).hex).toBe('#ff000088');
		expect(translucentRed.opaque(60).hex).toBe('#ff0000c4');
		expect(translucentRed.opaque(120).hex).toBe('#ff0000ff');
		expect(translucentRed.opaque(255).hex).toBe('#ff0000ff');

		const opaqueRed = new Colour('#ff0000ff');
		expect(opaqueRed.opaque(0).hex).toBe('#ff0000ff');
		expect(opaqueRed.opaque(60).hex).toBe('#ff0000ff');
		expect(opaqueRed.opaque(120).hex).toBe('#ff0000ff');
		expect(opaqueRed.opaque(255).hex).toBe('#ff0000ff');
	});

	it('will not make less transparent if offset is less than zero', () => {
		const red = new Colour('#ff000000');
		expect(red.opaque(-50).hex).toBe('#ff000000');
	});

	it('can chain methods together', () => {
		const coffee = new Colour('#c0ffee');
		expect(coffee.darken(50).lighten(50).hex).toBe('#c0ffee');
		expect(coffee.darken(50).darken(50).hex).toBe('#5c9b8a');
		expect(coffee.transparency(50).opaque(50).hex).toBe('#c0ffeeff');
		expect(coffee.darken(50).transparency(50).hex).toBe('#8ecdbccd');

		expect(coffee.shift(-50).shift(50).hex).toBe('#c0ffee');
		expect(coffee.opacity(50).opacity(-50).hex).toBe('#c0ffeeff');
	});

	describe('isHex static function', () => {
		it('retruns TRUE when a valid hexadecimal color is provided', () => {
			expect(Colour.isHex('#ff0000')).toBe(true);
			expect(Colour.isHex('#00ff00')).toBe(true);
			expect(Colour.isHex('#0000ff')).toBe(true);
			expect(Colour.isHex('#000000')).toBe(true);
			expect(Colour.isHex('#ffffff')).toBe(true);

			expect(Colour.isHex('#ff0000ff')).toBe(true);
			expect(Colour.isHex('#00ff00ff')).toBe(true);
			expect(Colour.isHex('#0000ffff')).toBe(true);
			expect(Colour.isHex('#000000ff')).toBe(true);
			expect(Colour.isHex('#ffffffff')).toBe(true);
		});

		it('works with uppercase letters', () => {
			expect(Colour.isHex('#FF0000')).toBe(true);
			expect(Colour.isHex('#00FF00')).toBe(true);
			expect(Colour.isHex('#0000FF')).toBe(true);
			expect(Colour.isHex('#000000')).toBe(true);
			expect(Colour.isHex('#FFFFFF')).toBe(true);
		});

		it('must start with a #', () => {
			expect(Colour.isHex('FF0000')).toBe(false);
		});

		it('must have either six or eight characters', () => {
			expect(Colour.isHex('#0')).toBe(false);
			expect(Colour.isHex('#00')).toBe(false);
			expect(Colour.isHex('#000')).toBe(false);
			expect(Colour.isHex('#0000')).toBe(false);
			expect(Colour.isHex('#00000')).toBe(false);
			expect(Colour.isHex('#000000')).toBe(true);
			expect(Colour.isHex('#0000000')).toBe(false);
			expect(Colour.isHex('#00000000')).toBe(true);
			expect(Colour.isHex('#000000000')).toBe(false);
		});

		it('cannot have non hex characters', () => {
			expect(Colour.isHex('#00000g')).toBe(false);
			expect(Colour.isHex('#00000!')).toBe(false);
			expect(Colour.isHex('#00000+')).toBe(false);
			expect(Colour.isHex('#00000[')).toBe(false);
			expect(Colour.isHex('#00000z')).toBe(false);
			expect(Colour.isHex('#000000+')).toBe(false);
		});
	});

	describe('isRgb static function', () => {
		it('retruns TRUE when a valid rgb color is provided', () => {
			expect(Colour.isRgb('rgba(0,0,0)')).toBe(true);
			expect(Colour.isRgb('rgba(0,0,0)')).toBe(true);
			expect(Colour.isRgb('rgba(0,0,0,0)')).toBe(true);
			expect(Colour.isRgb('rgba(0,0,0,0.5)')).toBe(true);
			expect(Colour.isRgb('rgba(0,0,0,50%)')).toBe(true);
			expect(Colour.isRgb('rgb(0,0,0)')).toBe(true);
			expect(Colour.isRgb('rgb(0,0,0)')).toBe(true);
			expect(Colour.isRgb('rgb(0,0,0,0)')).toBe(true);
			expect(Colour.isRgb('rgb(0,0,0,0.5)')).toBe(true);
			expect(Colour.isRgb('rgb(0,0,0,50%)')).toBe(true);
		});

		it('works with uppercase letters', () => {
			expect(Colour.isRgb('RGBA(0,0,0)')).toBe(true);
			expect(Colour.isRgb('RGBA(0,0,0)')).toBe(true);
			expect(Colour.isRgb('RGBA(0,0,0,0)')).toBe(true);
			expect(Colour.isRgb('RGBA(0,0,0,0.5)')).toBe(true);
		});
	});

	describe('hexToRgb static function', () => {
		it('throws when an invalid hex color is provided', () => {
			expect(() => {
				Colour.hexToRgb('rgb()');
			}).toThrow();

			expect(() => {
				Colour.hexToRgb('#ffff');
			}).toThrow();

			expect(() => {
				Colour.hexToRgb('nope');
			}).toThrow();
		});

		it('converts hex colors to rgb colors', () => {
			expect(Colour.hexToRgb('#ff0000')).toBe('rgb(255, 0, 0)');
			expect(Colour.hexToRgb('#00ff00')).toBe('rgb(0, 255, 0)');
			expect(Colour.hexToRgb('#0000ff')).toBe('rgb(0, 0, 255)');
			expect(Colour.hexToRgb('#3a23ad')).toBe('rgb(58, 35, 173)');
			expect(Colour.hexToRgb('#c0ffee')).toBe('rgb(192, 255, 238)');
		});

		it('converts hex colors with transparency to rgba colors', () => {
			expect(Colour.hexToRgb('#00000000')).toBe('rgba(0, 0, 0, 0)');
			expect(Colour.hexToRgb('#ffffff00')).toBe('rgba(255, 255, 255, 0)');
			expect(Colour.hexToRgb('#ff000027')).toBe('rgba(255, 0, 0, 0.15)');
			expect(Colour.hexToRgb('#00ff0077')).toBe('rgba(0, 255, 0, 0.47)');
			expect(Colour.hexToRgb('#0000ffb4')).toBe('rgba(0, 0, 255, 0.71)');
			expect(Colour.hexToRgb('#00ffffff')).toBe('rgba(0, 255, 255, 1)');
			expect(Colour.hexToRgb('#3a23adc3')).toBe('rgba(58, 35, 173, 0.76)');
			expect(Colour.hexToRgb('#3a23ade5')).toBe('rgba(58, 35, 173, 0.9)');
			expect(Colour.hexToRgb('#c0ffeef8')).toBe('rgba(192, 255, 238, 0.97)');
		});
	});

	describe('rgbToHex static function', () => {
		it('throws when an invalid rgb color is provided', () => {
			expect(() => {
				Colour.rgbToHex('rgb()');
			}).toThrow();

			expect(() => {
				Colour.rgbToHex('#ffff');
			}).toThrow();

			expect(() => {
				Colour.rgbToHex('nope');
			}).toThrow();
		});

		it('converts rgb colors to hex colors', () => {
			expect(Colour.rgbToHex('rgb(255, 0, 0)')).toBe('#ff0000');
			expect(Colour.rgbToHex('rgb(0, 255, 0)')).toBe('#00ff00');
			expect(Colour.rgbToHex('rgb(0, 0, 255)')).toBe('#0000ff');
			expect(Colour.rgbToHex('rgb(58, 35, 173)')).toBe('#3a23ad');
			expect(Colour.rgbToHex('rgb(192, 255, 238)')).toBe('#c0ffee');
		});

		it('converts rgb colors with transparency to hex transparency colors', () => {
			expect(Colour.rgbToHex('rgba(0, 0, 0, 0)')).toBe('#00000000');
			expect(Colour.rgbToHex('rgba(255, 255, 255, 0)')).toBe('#ffffff00');
			expect(Colour.rgbToHex('rgba(255, 0, 0, 0.153)')).toBe('#ff000027');
			expect(Colour.rgbToHex('rgba(0, 255, 0, 0.467)')).toBe('#00ff0077');
			expect(Colour.rgbToHex('rgba(0, 0, 255, 0.706)')).toBe('#0000ffb4');
			expect(Colour.rgbToHex('rgba(0, 255, 255, 1)')).toBe('#00ffffff');
			expect(Colour.rgbToHex('rgba(58, 35, 173, 0.765)')).toBe('#3a23adc3');
			expect(Colour.rgbToHex('rgba(192, 255, 238, 0.973)')).toBe('#c0ffeef8');
		});
	});

	describe('shift static function', () => {
		it('will return back an invalid hex color', () => {
			expect(Colour.brightness('#000', 255)).toBe('#000');
		});

		it('can shift hex colors', () => {
			expect(Colour.brightness('#000000', 255)).toBe('#ffffff');
			expect(Colour.brightness('#ffffff', 255)).toBe('#ffffff');

			expect(Colour.brightness('#000000', -255)).toBe('#000000');
			expect(Colour.brightness('#ffffff', -255)).toBe('#000000');

			expect(Colour.brightness('#ff0000', -127)).toBe('#800000');
			expect(Colour.brightness('#ff0000', 127)).toBe('#ff7f7f');

			expect(Colour.brightness('#3a23ad', -3000)).toBe('#000000');
			expect(Colour.brightness('#3a23ad', -255)).toBe('#000000');
			expect(Colour.brightness('#3a23ad', -180)).toBe('#000000');
			expect(Colour.brightness('#3a23ad', -127)).toBe('#00002e');
			expect(Colour.brightness('#3a23ad', -55)).toBe('#030076');
			expect(Colour.brightness('#3a23ad', -15)).toBe('#2b149e');
			expect(Colour.brightness('#3a23ad', 0)).toBe('#3a23ad');
			expect(Colour.brightness('#3a23ad', 15)).toBe('#4932bc');
			expect(Colour.brightness('#3a23ad', 55)).toBe('#715ae4');
			expect(Colour.brightness('#3a23ad', 127)).toBe('#b9a2ff');
			expect(Colour.brightness('#3a23ad', 180)).toBe('#eed7ff');
			expect(Colour.brightness('#3a23ad', 255)).toBe('#ffffff');
			expect(Colour.brightness('#3a23ad', 3000)).toBe('#ffffff');
		});

		it('can shift hex colors that have transparency', () => {
			expect(Colour.brightness('#3a23adff', -255)).toBe('#000000ff');
			expect(Colour.brightness('#3a23adff', -180)).toBe('#000000ff');
			expect(Colour.brightness('#3a23adff', -127)).toBe('#00002eff');
			expect(Colour.brightness('#3a23adff', -55)).toBe('#030076ff');
			expect(Colour.brightness('#3a23adff', -15)).toBe('#2b149eff');
			expect(Colour.brightness('#3a23adff', 0)).toBe('#3a23adff');
			expect(Colour.brightness('#3a23adff', 15)).toBe('#4932bcff');
			expect(Colour.brightness('#3a23adff', 55)).toBe('#715ae4ff');
			expect(Colour.brightness('#3a23adff', 127)).toBe('#b9a2ffff');
			expect(Colour.brightness('#3a23adff', 180)).toBe('#eed7ffff');
			expect(Colour.brightness('#3a23adff', 255)).toBe('#ffffffff');

			expect(Colour.brightness('#3a23adff', 0)).toBe('#3a23adff');
			expect(Colour.brightness('#3a23adf0', -15)).toBe('#2b149ef0');
			expect(Colour.brightness('#3a23adc8', -55)).toBe('#030076c8');
			expect(Colour.brightness('#3a23ad80', -127)).toBe('#00002e80');
			expect(Colour.brightness('#3a23ad4b', -180)).toBe('#0000004b');
			expect(Colour.brightness('#3a23ad00', -255)).toBe('#00000000');
		});

		it('can shift rgb colors', () => {
			expect(Colour.brightness('rgb(0, 0, 0)', 255)).toBe('rgb(255, 255, 255)');
			expect(Colour.brightness('rgb(255, 255, 255)', 255)).toBe('rgb(255, 255, 255)');

			expect(Colour.brightness('rgb(0, 0, 0)', -255)).toBe('rgb(0, 0, 0)');
			expect(Colour.brightness('rgb(255, 255, 255)', -255)).toBe('rgb(0, 0, 0)');

			expect(Colour.brightness('rgb(255, 0, 0)', -127)).toBe('rgb(128, 0, 0)');
			expect(Colour.brightness('rgb(255, 0, 0)', 127)).toBe('rgb(255, 127, 127)');

			expect(Colour.brightness('rgb(58, 35, 173)', -3000)).toBe('rgb(0, 0, 0)');
			expect(Colour.brightness('rgb(58, 35, 173)', -255)).toBe('rgb(0, 0, 0)');
			expect(Colour.brightness('rgb(58, 35, 173)', -180)).toBe('rgb(0, 0, 0)');
			expect(Colour.brightness('rgb(58, 35, 173)', -127)).toBe('rgb(0, 0, 46)');
			expect(Colour.brightness('rgb(58, 35, 173)', -55)).toBe('rgb(3, 0, 118)');
			expect(Colour.brightness('rgb(58, 35, 173)', -15)).toBe('rgb(43, 20, 158)');
			expect(Colour.brightness('rgb(58, 35, 173)', 0)).toBe('rgb(58, 35, 173)');
			expect(Colour.brightness('rgb(58, 35, 173)', 15)).toBe('rgb(73, 50, 188)');
			expect(Colour.brightness('rgb(58, 35, 173)', 55)).toBe('rgb(113, 90, 228)');
			expect(Colour.brightness('rgb(58, 35, 173)', 127)).toBe('rgb(185, 162, 255)');
			expect(Colour.brightness('rgb(58, 35, 173)', 180)).toBe('rgb(238, 215, 255)');
			expect(Colour.brightness('rgb(58, 35, 173)', 255)).toBe('rgb(255, 255, 255)');
			expect(Colour.brightness('rgb(58, 35, 173)', 3000)).toBe('rgb(255, 255, 255)');
		});

		it('can shift rgba colors', () => {
			expect(Colour.brightness('rgb(58, 35, 173, 1)', -255)).toBe('rgba(0, 0, 0, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', -180)).toBe('rgba(0, 0, 0, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', -127)).toBe('rgba(0, 0, 46, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', -55)).toBe('rgba(3, 0, 118, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', -15)).toBe('rgba(43, 20, 158, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', 0)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', 15)).toBe('rgba(73, 50, 188, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', 55)).toBe('rgba(113, 90, 228, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', 127)).toBe('rgba(185, 162, 255, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', 180)).toBe('rgba(238, 215, 255, 1)');
			expect(Colour.brightness('rgb(58, 35, 173, 1)', 255)).toBe('rgba(255, 255, 255, 1)');

			expect(Colour.brightness('rgb(58, 35, 173, 0.9)', -15)).toBe('rgba(43, 20, 158, 0.9)');
			expect(Colour.brightness('rgb(58, 35, 173, 0.8)', -55)).toBe('rgba(3, 0, 118, 0.8)');
			expect(Colour.brightness('rgb(58, 35, 173, 0.5)', -127)).toBe('rgba(0, 0, 46, 0.5)');
			expect(Colour.brightness('rgb(58, 35, 173, 0.3)', -180)).toBe('rgba(0, 0, 0, 0.3)');
			expect(Colour.brightness('rgb(58, 35, 173, 0)', -255)).toBe('rgba(0, 0, 0, 0)');
		});
	});

	describe('opacity static function', () => {
		it('will return back an invalid hex color', () => {
			expect(Colour.opacity('#000', 255)).toBe('#000');
		});

		it('can change opacity of hex colors', () => {
			expect(Colour.opacity('#3a23ad', -3000)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', -255)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', -180)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', -127)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', -55)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', -15)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', 0)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad', 15)).toBe('#3a23adf0');
			expect(Colour.opacity('#3a23ad', 55)).toBe('#3a23adc8');
			expect(Colour.opacity('#3a23ad', 127)).toBe('#3a23ad80');
			expect(Colour.opacity('#3a23ad', 180)).toBe('#3a23ad4b');
			expect(Colour.opacity('#3a23ad', 255)).toBe('#3a23ad00');
			expect(Colour.opacity('#3a23ad', 3000)).toBe('#3a23ad00');
		});

		it('can change opacity of hex colors that have transparency', () => {
			expect(Colour.opacity('#3a23adff', 0)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23adff', 15)).toBe('#3a23adf0');
			expect(Colour.opacity('#3a23adff', 55)).toBe('#3a23adc8');
			expect(Colour.opacity('#3a23adff', 127)).toBe('#3a23ad80');
			expect(Colour.opacity('#3a23adff', 180)).toBe('#3a23ad4b');
			expect(Colour.opacity('#3a23adff', 255)).toBe('#3a23ad00');

			expect(Colour.opacity('#3a23adf0', -15)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23adc8', -55)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad80', -127)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad4b', -180)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad00', -255)).toBe('#3a23adff');

			expect(Colour.opacity('#3a23ad00', -255)).toBe('#3a23adff');
			expect(Colour.opacity('#3a23ad00', -180)).toBe('#3a23adb4');
			expect(Colour.opacity('#3a23ad00', -127)).toBe('#3a23ad7f');
			expect(Colour.opacity('#3a23ad00', -55)).toBe('#3a23ad37');
			expect(Colour.opacity('#3a23ad00', -15)).toBe('#3a23ad0f');
			expect(Colour.opacity('#3a23ad00', 0)).toBe('#3a23ad00');
			expect(Colour.opacity('#3a23ad00', 15)).toBe('#3a23ad00');
			expect(Colour.opacity('#3a23ad00', 55)).toBe('#3a23ad00');
			expect(Colour.opacity('#3a23ad00', 127)).toBe('#3a23ad00');
			expect(Colour.opacity('#3a23ad00', 180)).toBe('#3a23ad00');
			expect(Colour.opacity('#3a23ad00', 255)).toBe('#3a23ad00');
		});

		it('can change opacity of rgb colors', () => {
			expect(Colour.opacity('rgb(58, 35, 173)', -3000)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', -255)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', -180)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', -127)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', -55)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', -15)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', 0)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173)', 15)).toBe('rgba(58, 35, 173, 0.94)');
			expect(Colour.opacity('rgb(58, 35, 173)', 55)).toBe('rgba(58, 35, 173, 0.78)');
			expect(Colour.opacity('rgb(58, 35, 173)', 127)).toBe('rgba(58, 35, 173, 0.5)');
			expect(Colour.opacity('rgb(58, 35, 173)', 180)).toBe('rgba(58, 35, 173, 0.29)');
			expect(Colour.opacity('rgb(58, 35, 173)', 255)).toBe('rgba(58, 35, 173, 0)');
			expect(Colour.opacity('rgb(58, 35, 173)', 3000)).toBe('rgba(58, 35, 173, 0)');
		});

		it('can change opacity of rgba colors', () => {
			expect(Colour.opacity('rgb(58, 35, 173, 1)', 0)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173, 1)', 15)).toBe('rgba(58, 35, 173, 0.94)');
			expect(Colour.opacity('rgb(58, 35, 173, 1)', 55)).toBe('rgba(58, 35, 173, 0.78)');
			expect(Colour.opacity('rgb(58, 35, 173, 1)', 127)).toBe('rgba(58, 35, 173, 0.5)');
			expect(Colour.opacity('rgb(58, 35, 173, 1)', 180)).toBe('rgba(58, 35, 173, 0.29)');
			expect(Colour.opacity('rgb(58, 35, 173, 1)', 255)).toBe('rgba(58, 35, 173, 0)');

			expect(Colour.opacity('rgb(58, 35, 173, 0.9)', -15)).toBe('rgba(58, 35, 173, 0.96)');
			expect(Colour.opacity('rgb(58, 35, 173, 0.8)', -55)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173, 0.5)', -127)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173, 0.3)', -180)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', -255)).toBe('rgba(58, 35, 173, 1)');

			expect(Colour.opacity('rgb(58, 35, 173, 0)', -255)).toBe('rgba(58, 35, 173, 1)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', -180)).toBe('rgba(58, 35, 173, 0.71)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', -127)).toBe('rgba(58, 35, 173, 0.5)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', -55)).toBe('rgba(58, 35, 173, 0.22)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', -15)).toBe('rgba(58, 35, 173, 0.06)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', 0)).toBe('rgba(58, 35, 173, 0)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', 15)).toBe('rgba(58, 35, 173, 0)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', 55)).toBe('rgba(58, 35, 173, 0)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', 127)).toBe('rgba(58, 35, 173, 0)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', 180)).toBe('rgba(58, 35, 173, 0)');
			expect(Colour.opacity('rgb(58, 35, 173, 0)', 255)).toBe('rgba(58, 35, 173, 0)');
		});
	});
});
