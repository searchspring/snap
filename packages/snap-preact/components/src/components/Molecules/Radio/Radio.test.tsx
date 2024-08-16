import { h } from 'preact';

import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Radio } from './Radio';
import { iconPaths } from '../../Atoms/Icon';
import { Theme, ThemeProvider } from '../../../providers';
import { A11Y_ATTRIBUTE } from '../../../hooks/useA11y';

describe('Radio Component', () => {
	const globalTheme = {
		components: {
			radio: {
				className: 'global-theme-class',
			},
		},
	} as Theme;

	const propTheme = {
		components: {
			radio: {
				className: 'props-theme-class',
			},
		},
	} as Theme;

	describe('styled', () => {
		it('renders', () => {
			const rendered = render(<Radio />);
			const RadioElement = rendered.container.querySelector('.ss__radio');

			expect(RadioElement).toBeInTheDocument();
			expect(RadioElement?.classList.length).toBe(2);
			expect(RadioElement?.className.match(/disabled/)).toBeFalsy();
		});

		it('is not checked by default', () => {
			const rendered = render(<Radio />);
			const active = rendered.container.querySelector('.ss__radio__icon--active');
			const inactive = rendered.container.querySelector('.ss__radio__icon--inactive');

			expect(active).not.toBeInTheDocument();
			expect(inactive).toBeInTheDocument();
		});

		it('can handle checked state internally', () => {
			const rendered = render(<Radio startChecked={true} />);
			const active = rendered.container.querySelector('.ss__radio__icon--active');

			expect(active).toBeInTheDocument();
		});

		it('renders bullet icon when active', () => {
			const rendered = render(<Radio checked />);
			const svgElement = rendered.container.querySelector('.ss__icon--bullet');

			expect(svgElement).toBeInTheDocument();
		});

		it('renders bullet-o icon when inactive', () => {
			const rendered = render(<Radio checked={false} />);
			const svgElement = rendered.container.querySelector('.ss__icon--bullet-o');

			expect(svgElement).toBeInTheDocument();
		});

		it('fires onClick prop when clicked', async () => {
			const clickFn = jest.fn();

			const rendered = render(<Radio onClick={clickFn} />);

			const RadioElement = rendered.container.querySelector('.ss__radio')!;

			await userEvent.click(RadioElement);
			expect(clickFn).toHaveBeenCalled();
		});

		it('renders with additional style using prop', () => {
			const style = {
				padding: '20px',
			};

			const rendered = render(<Radio style={style} />);
			const RadioElement = rendered.container.querySelector('.ss__radio')!;
			const styles = getComputedStyle(RadioElement);

			expect(styles.padding).toBe(style.padding);
		});

		it('Can enable/disable useAlly with disableA11y prop', () => {
			const rendered = render(<Radio checked />);

			const element = rendered.container.querySelector('.ss__radio');

			expect(element).toBeInTheDocument();

			expect(element).toHaveAttribute(A11Y_ATTRIBUTE);

			const rendered2 = render(<Radio checked disableA11y />);

			const element2 = rendered2.container.querySelector('.ss__radio');
			expect(element2).not.toHaveAttribute(A11Y_ATTRIBUTE);
		});

		it('respects the disabled prop', () => {
			const clickFn = jest.fn();
			const rendered = render(<Radio disabled onClick={clickFn} />);
			const RadioElement = rendered.container.querySelector('.ss__radio');

			expect(RadioElement?.className.match(/disabled/)).toBeTruthy();
			if (RadioElement) userEvent.click(RadioElement);
			expect(clickFn).not.toHaveBeenCalled();
		});

		it('passes props to icon', async () => {
			const checkedIcon = 'close-thin';
			const unCheckedIcon = 'star';
			const color = 'blue';
			const size = '12px';

			const rendered = render(<Radio size={size} checkedIcon={checkedIcon} unCheckedIcon={unCheckedIcon} color={color} />);
			const RadioElement = rendered.container.querySelector('.ss__radio');
			const svg = RadioElement?.querySelector('svg')!;
			const path = svg.querySelector('path');

			const styles = getComputedStyle(svg);

			expect(styles.width).toBe(`${size}`);
			expect(styles.height).toBe(`${size}`);
			expect(styles.fill).toBe(color);
			expect(path).toHaveAttribute('d', iconPaths[unCheckedIcon]);

			userEvent.click(RadioElement!);

			await waitFor(() => {
				expect(path).toHaveAttribute('d', iconPaths[checkedIcon]);
				expect(styles.width).toBe(`${size}`);
				expect(styles.height).toBe(`${size}`);
				expect(styles.fill).toBe(color);
			});
		});

		it('can use iconColor prop instead of color', () => {
			const icon = 'close-thin';
			const color = 'blue';
			const size = '12px';

			const rendered = render(<Radio checked size={size} checkedIcon={icon} color={color} />);
			const RadioElement = rendered.container.querySelector('.ss__radio');
			const svg = RadioElement?.querySelector('svg')!;
			const styles = getComputedStyle(svg);
			expect(styles.fill).toBe(color);
		});

		it('can disableStyles', () => {
			const rendered = render(<Radio disableStyles />);
			const RadioElement = rendered.container.querySelector('.ss__radio');

			expect(rendered.container).toBeInTheDocument();
			expect(RadioElement?.classList.length).toBe(1);
			expect(RadioElement?.className.match(/disabled/)).toBeFalsy();
		});

		describe('Radio lang works', () => {
			const selector = '.ss__radio';

			it('immediately available lang options', async () => {
				const langOptions = ['radio'];

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
						const rendered = render(<Radio lang={lang} />);

						const element = rendered.container.querySelector(selector);
						expect(element).toBeInTheDocument();
						const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);
						console.log(option);
						expect(langElem).toBeInTheDocument();
						if (typeof langObj.value == 'function') {
							expect(langElem?.innerHTML).toBe(value);
							expect(valueMock).toHaveBeenCalledWith({
								disabled: undefined,
								checkedState: false,
							});
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
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Radio checked />
				</ThemeProvider>
			);

			const RadioElement = rendered.container.querySelector('.ss__radio');

			expect(RadioElement).toHaveClass(globalTheme.components?.radio?.className!);
		});

		it('is themeable with theme prop', () => {
			const rendered = render(<Radio checked theme={propTheme} />);

			const RadioElement = rendered.container.querySelector('.ss__radio');

			expect(RadioElement).toHaveClass(propTheme.components?.radio?.className!);
		});

		it('is themeable and theme prop overrides ThemeProvider', () => {
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Radio checked theme={propTheme} />
				</ThemeProvider>
			);

			const RadioElement = rendered.container.querySelector('.ss__radio');

			expect(RadioElement).toHaveClass(propTheme.components?.radio?.className!);
			expect(RadioElement).not.toHaveClass(globalTheme.components?.radio?.className!);
		});
	});

	describe('native', () => {
		it('renders', () => {
			const rendered = render(<Radio native />);
			const RadioElement = rendered.container.querySelector('.ss__radio');
			const inputElement = rendered.container.querySelector('input');

			expect(rendered.container).toBeInTheDocument();
			expect(RadioElement).toBeInTheDocument();
			expect(RadioElement?.className.match(/disabled/)).toBeFalsy();
			expect(inputElement).not.toHaveAttribute('disabled');
		});

		it('is not checked by default', () => {
			const rendered = render(<Radio native />);
			const inputElement = rendered.container.querySelector('input');

			expect(inputElement).toBeInTheDocument();
			expect(inputElement?.checked).toBe(false);
		});

		it('can handle checked state internally', () => {
			const rendered = render(<Radio native startChecked={true} />);
			const inputElement = rendered.container.querySelector('input');

			expect(inputElement).toBeInTheDocument();
			expect(inputElement?.checked).toBe(true);
		});

		it('does not render an icon when checked', () => {
			const rendered = render(<Radio native checked />);
			const svgElement = rendered.container.querySelector('svg');
			const inputElement = rendered.container.querySelector('input');

			expect(svgElement).not.toBeInTheDocument();
			expect(inputElement).toBeInTheDocument();
			expect(inputElement?.checked).toBe(true);
		});

		it('fires onClick prop when clicked', async () => {
			const clickFn = jest.fn();

			const rendered = render(<Radio native onClick={clickFn} />);

			const RadioElement = rendered.container.querySelector('.ss__radio__input')!;

			await userEvent.click(RadioElement);
			expect(clickFn).toHaveBeenCalled();
		});

		it('respects the disabled prop', () => {
			const clickFn = jest.fn();
			const rendered = render(<Radio native disabled />);
			const RadioElement = rendered.container.querySelector('.ss__radio')!;
			const radioInput = rendered.container.querySelector('.ss__radio__input');

			expect(RadioElement.className.match(/disabled/)).toBeTruthy();
			expect(radioInput).toHaveAttribute('disabled');
			userEvent.click(radioInput!);
			expect(clickFn).not.toHaveBeenCalled();
		});

		it('renders with additional style using prop', () => {
			const style = {
				padding: '20px',
			};

			const rendered = render(<Radio native style={style} />);
			const RadioElement = rendered.container.querySelector('.ss__radio')!;
			const styles = getComputedStyle(RadioElement);

			expect(styles.padding).toBe(style.padding);
		});

		it('is themeable with ThemeProvider', () => {
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Radio native />
				</ThemeProvider>
			);

			const RadioElement = rendered.container.querySelector('.ss__radio');
			expect(RadioElement).toHaveClass(globalTheme.components?.radio?.className!);
		});

		it('is themeable with theme prop', () => {
			const rendered = render(<Radio native theme={propTheme} />);

			const RadioElement = rendered.container.querySelector('.ss__radio');
			expect(RadioElement).toHaveClass(propTheme.components?.radio?.className!);
		});

		it('is themeable and theme prop overrides ThemeProvider', () => {
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Radio native theme={propTheme} />
				</ThemeProvider>
			);

			const RadioElement = rendered.container.querySelector('.ss__radio');
			expect(RadioElement).toHaveClass(propTheme.components?.radio?.className!);
			expect(RadioElement).not.toHaveClass(globalTheme.components?.radio?.className!);
		});
	});
});
