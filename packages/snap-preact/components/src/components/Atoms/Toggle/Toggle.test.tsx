import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { Toggle } from './Toggle';

describe('Toggle Component', () => {
	const label = 'sale';

	it('renders', () => {
		const rendered = render(<Toggle />);
		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
	});

	it('renders label', () => {
		const rendered = render(<Toggle label={label} />);

		const element = rendered.container.querySelector('.ss__toggle');
		const labelElem = rendered.container.querySelector('.ss__toggle__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).toHaveTextContent(label);
	});

	it('renders with round prop', () => {
		const rendered = render(<Toggle round={true} />);

		const element = rendered.container.querySelector('.ss__toggle');
		const slider = rendered.container.querySelector('.ss__toggle__slider');

		expect(element).toBeInTheDocument();
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__toggle__slider--round');
		let styles = getComputedStyle(slider!);
		expect(styles.borderRadius).toBe('calc(60px / 2)');
	});

	it('can set toggled state', () => {
		const rendered = render(<Toggle toggled={true} />);

		const slider = rendered.container.querySelector('.ss__toggle__switch');

		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__toggle__switch--filtered');
	});

	it('can change the colors', async () => {
		const activeColor = 'orange';
		const inactiveColor = 'red';
		const buttonColor = 'blue';
		const rendered = render(<Toggle activeColor={activeColor} inactiveColor={inactiveColor} buttonColor={buttonColor} />);

		const element = rendered.container.querySelector('.ss__toggle');
		const slider = rendered.container.querySelector('.ss__toggle__slider-box');
		const toggle = rendered.container.querySelector('.ss__toggle__switch');

		expect(element).toBeInTheDocument();
		expect(slider).toBeInTheDocument();
		let styles = getComputedStyle(slider!);
		expect(styles.backgroundColor).toBe(inactiveColor);

		userEvent.click(toggle!);

		await waitFor(() => {
			let styles = getComputedStyle(slider!);
			expect(styles.backgroundColor).toBe(activeColor);
		});
	});

	it('can disable styling', () => {
		const rendered = render(<Toggle disableStyles={true} />);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Toggle className={className} />);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can set custom onClick func', async () => {
		const onClickFunc = jest.fn();
		const rendered = render(<Toggle onClick={onClickFunc} />);

		const element = rendered.container.querySelector('.ss__toggle__switch')!;
		expect(element).toBeInTheDocument();
		userEvent.click(element);

		await waitFor(() => {
			expect(onClickFunc).toHaveBeenCalled();
		});
	});

	it('onclick toggles toggled state', async () => {
		const rendered = render(<Toggle toggled={true} />);

		const slider = rendered.container.querySelector('.ss__toggle__switch');

		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__toggle__switch--filtered');

		userEvent.click(slider!);

		await waitFor(() => {
			const slider = rendered.container.querySelector('.ss__toggle__switch');
			expect(slider).not.toHaveClass('ss__toggle__switch--filtered');
		});

		userEvent.click(slider!);

		await waitFor(() => {
			const slider = rendered.container.querySelector('.ss__toggle__switch');
			expect(slider).toHaveClass('ss__toggle__switch--filtered');
		});
	});

	describe('Toggle lang works', () => {
		const selector = '.ss__toggle';

		it('immediately available lang options', async () => {
			const langOptions = ['toggleSwitch'];

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

			langOptions.forEach((option) => {
				langObjs.forEach((langObj) => {
					const lang = {
						[`${option}`]: langObj,
					};
					// @ts-ignore
					const rendered = render(<Toggle lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();
					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
						expect(valueMock).toHaveBeenCalledWith({
							disabled: undefined,
							label: undefined,
							round: true,
							toggledState: false,
						});

						expect(langElem?.innerHTML).toBe(value);
					} else {
						expect(langElem?.innerHTML).toBe(langObj.value);
					}

					expect(langElem).toHaveAttribute('alt', altText);
					expect(langElem).toHaveAttribute('aria-label', ariaLabel);
					expect(langElem).toHaveAttribute('aria-valuetext', ariaValueText);
					expect(langElem).toHaveAttribute('title', title);

					jest.restoreAllMocks();
				});
			});
		});
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				toggle: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Toggle />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.toggle.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				toggle: {
					className: 'classy',
				},
			},
		};

		const rendered = render(<Toggle theme={propTheme} />);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.toggle.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				toggle: {
					className: 'notclassy',
				},
			},
		};
		const propTheme = {
			components: {
				toggle: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Toggle theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.toggle.className);
		expect(element).not.toHaveClass(globalTheme.components.toggle.className);
	});
});
