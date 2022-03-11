import { Logger, LogMode } from './Logger';
import { colors } from './colors';
import { emoji } from './emoji';
import { Profiler } from '@searchspring/snap-profiler';

describe('Logger', () => {
	let consoleLogMock: any = jest.fn();
	beforeEach(() => {
		consoleLogMock.mockClear();
		consoleLogMock = jest.spyOn(console, 'log');
	});

	afterAll(() => {
		consoleLogMock.mockRestore();
	});

	const customPrefix = 'custom namespace:';
	const prefix = '';

	describe('error method', () => {
		it('can use the logger to error', () => {
			const logger = new Logger();
			const text = 'this is a error';
			logger.error(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.bang} %c${prefix}${text}`,
				`color: ${colors.red}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.red}; font-weight: bold;`
			);
		});

		it('can use the logger to error with a custom namespace', () => {
			const logger = new Logger(customPrefix);
			const text = 'this is a error';
			logger.error(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.bang} %c${customPrefix}${text}`,
				`color: ${colors.red}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.red}; font-weight: bold;`
			);
		});

		it('CAN use the logger to error log if mode is not dev', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);

			const text = 'this is a error log on production mode';
			logger.error(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.bang} %c${prefix}${text}`,
				`color: ${colors.red}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.red}; font-weight: bold;`
			);
		});
	});

	describe('warn method', () => {
		it('can use the logger to warn', () => {
			const logger = new Logger();
			const text = 'this is a warning';
			logger.warn(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.warning} %c${prefix}%c${text}`,
				`color: ${colors.yellow}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.yellow}; font-weight: normal;`,
				`color: ${colors.yellow}; font-weight: bold;`
			);
		});

		it('can use the logger to warn with a custom namespace', () => {
			const logger = new Logger(customPrefix);
			const text = 'this is a warning';
			logger.warn(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.warning} %c${customPrefix}%c${text}`,
				`color: ${colors.yellow}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.yellow}; font-weight: normal;`,
				`color: ${colors.yellow}; font-weight: bold;`
			);
		});

		it('CAN use the logger to warn log if mode is not dev', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);

			const text = 'this is a warn log on production mode';
			logger.warn(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.warning} %c${prefix}%c${text}`,
				`color: ${colors.yellow}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.yellow}; font-weight: normal;`,
				`color: ${colors.yellow}; font-weight: bold;`
			);
		});
	});

	describe('dev method', () => {
		it('can use the logger to dev log', () => {
			const logger = new Logger();
			logger.setMode(LogMode.DEVELOPMENT);

			const text = 'this is a dev log';
			logger.dev(text);

			expect(console.log).toHaveBeenCalledWith(text);
		});

		it('cant use the logger to dev log if mode is not dev', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);

			const text = 'this is a dev log on production mode';
			logger.dev(text);

			expect(console.log).not.toHaveBeenCalledWith(text);
		});
	});

	describe('debug method', () => {
		it('can use the logger to debug log', () => {
			const logger = new Logger();
			logger.setMode(LogMode.DEVELOPMENT);

			const text = 'this is a debug log';
			logger.debug(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.interobang} %c${prefix}${text}`,
				`color: ${colors.orangelight}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.orangelight}; font-weight: bold;`
			);
		});

		it('cant use the logger to debug log on production mode', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);

			const text = 'this is a debug log';
			logger.debug(text);

			expect(console.log).not.toHaveBeenCalled();
		});

		it('can use the logger to debug log with a custom namespace', () => {
			const logger = new Logger(customPrefix);
			logger.setMode(LogMode.DEVELOPMENT);

			const text = 'this is a debug log with custom namespace';
			logger.debug(text);

			expect(console.log).toHaveBeenCalledWith(
				`%c ${emoji.interobang} %c${customPrefix}${text}`,
				`color: ${colors.orangelight}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${colors.orangelight}; font-weight: bold;`
			);
		});
	});

	describe('image method', () => {
		it('can use the logger to image log', () => {
			const logger = new Logger();
			logger.setMode(LogMode.DEVELOPMENT);

			logger.image({
				url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
				width: '30px',
				height: '30px',
			});

			expect(console.log).toHaveBeenCalledWith(
				`%c...`,
				'font-size: 1px; padding: 30px 30px; background: url("https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png") no-repeat; background-size: contain;'
			);
		});

		it('cant use the logger to image log on production mode', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);

			logger.image({
				url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
				width: '30px',
				height: '30px',
			});

			expect(console.log).not.toHaveBeenCalled();
		});
	});

	describe('imageText method', () => {
		it('can use the logger to imageText log', () => {
			const logger = new Logger();
			logger.setMode(LogMode.DEVELOPMENT);

			logger.imageText({
				url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
				text: 'some text here',
				style: 'color: #4c3ce2; font-weight: bold;',
			});

			expect(console.log).toHaveBeenCalledWith(
				'%c   some text here',
				'margin-left: 6px; background: url("https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png") no-repeat; background-size: contain; color: #4c3ce2; font-weight: bold;'
			);
		});

		it('cant use the logger to imageText log on production mode', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);

			logger.imageText({
				url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
				text: 'some text here',
				style: 'color: #4c3ce2; font-weight: bold;',
			});

			expect(console.log).not.toHaveBeenCalled();
		});

		it('can use the logger to imageText log with a custom namespace', () => {
			const logger = new Logger(customPrefix);
			logger.setMode(LogMode.DEVELOPMENT);

			logger.imageText({
				url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
				text: 'some text here',
				style: 'color: #4c3ce2; font-weight: bold;',
			});

			expect(console.log).toHaveBeenCalledWith(
				'%c   custom namespace:some text here',
				'margin-left: 6px; background: url("https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png") no-repeat; background-size: contain; color: #4c3ce2; font-weight: bold;'
			);
		});
	});

	describe('profile method', () => {
		it('can use the logger to imageText log', () => {
			const logger = new Logger();
			logger.setMode(LogMode.DEVELOPMENT);

			const profiler = new Profiler();

			const searchProfile = profiler.create({
				type: 'event',
				name: 'search',
				context: {},
			});

			searchProfile.start();
			searchProfile.stop();

			logger.profile(searchProfile);

			expect(console.log).toHaveBeenCalledWith(
				`%c ⚙ %c%cevent  %c~  search  ::  %cFINISHED  ::  %c${searchProfile?.time?.run}ms`,
				'color: #ecaa15; font-size: 14px; line-height: 12px;',
				'color: #ecaa15;',
				'color: #ecaa15; font-style: italic;',
				'color: #ecaa15;',
				'color: #ecaa15; font-weight: bold;',
				'color: #61717B;'
			);
		});

		it('cant use the logger to profile log on production mode', () => {
			const logger = new Logger();
			logger.setMode(LogMode.PRODUCTION);
			const profiler = new Profiler();

			const searchProfile = profiler.create({
				type: 'event',
				name: 'search',
				context: {},
			});

			searchProfile.start();
			searchProfile.stop();

			logger.profile(searchProfile);

			expect(console.log).not.toHaveBeenCalled();
		});

		it('can use the logger to profile log with a custom namespace', () => {
			const logger = new Logger(customPrefix);
			logger.setMode(LogMode.DEVELOPMENT);

			const profiler = new Profiler();

			const searchProfile = profiler.create({
				type: 'event',
				name: 'search',
				context: {},
			});

			searchProfile.start();
			searchProfile.stop();

			logger.profile(searchProfile);

			expect(console.log).toHaveBeenCalledWith(
				`%c ⚙ %ccustom namespace:%cevent  %c~  search  ::  %cFINISHED  ::  %c${searchProfile?.time?.run}ms`,
				'color: #ecaa15; font-size: 14px; line-height: 12px;',
				'color: #ecaa15;',
				'color: #ecaa15; font-style: italic;',
				'color: #ecaa15;',
				'color: #ecaa15; font-weight: bold;',
				'color: #61717B;'
			);
		});
	});
});
