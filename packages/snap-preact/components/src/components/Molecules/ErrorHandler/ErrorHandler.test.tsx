import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ErrorType } from '@searchspring/snap-store-mobx';

import { ThemeProvider } from '../../../providers/theme';
import { ErrorHandler } from './ErrorHandler';

describe('Error Handler Component', () => {
	const error = {
		type: ErrorType.WARNING,
		message: 'hello',
	};

	it('renders using custom error', () => {
		const rendered = render(<ErrorHandler error={error} />);
		const errorElement = rendered.container.querySelector('.ss__error-handler');
		expect(errorElement).toBeInTheDocument();
	});

	it('can use custom retry onClick event', () => {
		const onClick = jest.fn();
		const rendered = render(<ErrorHandler error={{ code: 429, ...error }} onRetryClick={onClick} />);
		const errorElement = rendered.container.querySelector('.ss__error-handler');
		const retryButton = errorElement?.querySelector('.ss__error-handler__button')!;
		expect(errorElement).toBeInTheDocument();
		expect(retryButton).toBeInTheDocument();

		userEvent.click(retryButton);
		expect(onClick).toHaveBeenCalled();
	});

	it('can disable styling', () => {
		const rendered = render(<ErrorHandler error={error} disableStyles={true} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement?.classList.length).toBe(2);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<ErrorHandler error={error} className={className} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(className);
	});

	describe('ErrorHandler lang works', () => {
		const selector = '.ss__error-handler';

		const eCodeKey = {
			warningText: {
				code: 500,
				type: ErrorType.WARNING,
				message: 'hello',
			},
			infoText: {
				code: 500,
				type: ErrorType.INFO,
				message: 'hello',
			},
			errorText: {
				code: 500,
				type: ErrorType.ERROR,
				message: 'hello',
			},
			reloadText: {
				code: 429,
				type: ErrorType.WARNING,
				message: 'hello',
			},
		};

		it('immediately available lang options', async () => {
			const langOptions = ['warningText', 'infoText', 'errorText', 'reloadText'];

			//text attributes/values
			const value = 'custom value';
			const altText = 'custom alt';
			const ariaLabel = 'custom label';
			const ariaValueText = 'custom value text';
			const title = 'custom title';

			const valueMock = jest.fn(() => value);
			const altMock = jest.fn(() => altText);
			const labelMock = jest.fn(() => ariaLabel);
			const valueTextMock = jest.fn(() => ariaValueText);
			const titleMock = jest.fn(() => title);

			const langObjs = [
				{
					value: value,
					attributes: {
						alt: altText,
						'aria-label': ariaLabel,
						'aria-valuetext': ariaValueText,
						title: title,
					},
				},
				{
					value: valueMock,
					attributes: {
						alt: altMock,
						'aria-label': labelMock,
						'aria-valuetext': valueTextMock,
						title: titleMock,
					},
				},
				{
					value: `<div>${value}</div>`,
					attributes: {
						alt: altText,
						'aria-label': ariaLabel,
						'aria-valuetext': ariaValueText,
						title: title,
					},
				},
			];

			let valueSatified = false;
			let altSatified = false;
			let labelSatified = false;
			let valueTextSatified = false;
			let titleSatified = false;

			langOptions.forEach((option) => {
				langObjs.forEach((langObj) => {
					const lang = {
						[`${option}`]: langObj,
					};

					const eCode = eCodeKey[option as keyof typeof eCodeKey];

					const rendered = render(<ErrorHandler lang={lang} error={eCode} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
					expect(langElems.length).toBeGreaterThan(0);

					langElems.forEach((elem) => {
						if (typeof langObj.value == 'function') {
							expect(valueMock).toHaveBeenCalledWith({});

							if (elem?.innerHTML == value) {
								valueSatified = true;
							}
						} else {
							if (elem?.innerHTML == langObj.value) {
								valueSatified = true;
							}
						}

						if (elem.getAttribute('alt') == altText) {
							altSatified = true;
						}
						if (elem.getAttribute('aria-label') == ariaLabel) {
							labelSatified = true;
						}
						if (elem.getAttribute('aria-valuetext') == ariaValueText) {
							valueTextSatified = true;
						}
						if (elem.getAttribute('title') == title) {
							titleSatified = true;
						}
					});

					expect(valueSatified).toBeTruthy();
					expect(altSatified).toBeTruthy();
					expect(labelSatified).toBeTruthy();
					expect(valueTextSatified).toBeTruthy();
					expect(titleSatified).toBeTruthy();

					jest.restoreAllMocks();
				});
			});
		});
	});

	const gTheme = {
		components: {
			errorHandler: {
				className: 'GlobalThemeClass',
			},
		},
	};

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={gTheme}>
				<ErrorHandler error={error} />
			</ThemeProvider>
		);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(gTheme.components.errorHandler.className);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<ErrorHandler error={error} theme={gTheme} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(gTheme.components.errorHandler.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				errorHandler: {
					className: 'themeOverride',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={gTheme}>
				<ErrorHandler error={error} theme={themeOverride} />
			</ThemeProvider>
		);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(themeOverride.components.errorHandler.className);
		expect(ErrorElement).not.toHaveClass(gTheme.components.errorHandler.className);
	});
});
