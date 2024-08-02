import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Checkbox } from './Checkbox';
import { iconPaths } from '../../Atoms/Icon';
import { ThemeProvider } from '../../../providers';

const globalTheme = {
	components: {
		checkbox: {
			className: 'global-theme-class',
		},
		icon: {
			color: 'blue',
		},
	},
};

const propTheme = {
	components: {
		checkbox: {
			className: 'props-theme-class',
		},
		icon: {
			color: 'red',
		},
	},
};

describe('Checkbox Component', () => {
	describe('styled', () => {
		it('renders', () => {
			const rendered = render(<Checkbox />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox');

			expect(checkboxElement).toBeInTheDocument();
			expect(checkboxElement?.classList.length).toBe(2);
			expect(checkboxElement?.className.match(/disabled/)).toBeFalsy();
		});

		it('is not checked by default', () => {
			const rendered = render(<Checkbox />);
			const svgElement = rendered.container.querySelector('svg');

			expect(svgElement).not.toBeInTheDocument();
		});

		it('can handle checked state internally', () => {
			const rendered = render(<Checkbox startChecked={true} />);
			const svgElement = rendered.container.querySelector('svg');

			expect(svgElement).toBeInTheDocument();
		});

		it('renders an icon when checked', () => {
			const rendered = render(<Checkbox checked />);
			const svgElement = rendered.container.querySelector('svg');

			expect(svgElement).toBeInTheDocument();
		});

		it('fires onClick prop when clicked', () => {
			const clickFn = jest.fn();

			const rendered = render(<Checkbox onClick={clickFn} />);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox')!;

			userEvent.click(checkboxElement);
			expect(clickFn).toHaveBeenCalled();
		});

		it('renders with additional style using prop', () => {
			const style = {
				padding: '20px',
			};

			const rendered = render(<Checkbox style={style} />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox')!;
			const styles = getComputedStyle(checkboxElement);

			expect(styles.padding).toBe(style.padding);
		});

		it('Can enable/disable useAlly with disableA11y prop', () => {
			const rendered = render(<Checkbox checked />);

			const checkbox = rendered.container.querySelector('.ss__checkbox');

			expect(checkbox).toBeInTheDocument();

			expect(checkbox).toHaveAttribute('ssA11y');

			const rendered2 = render(<Checkbox checked disableA11y />);

			const checkbox2 = rendered2.container.querySelector('.ss__checkbox');
			expect(checkbox2).not.toHaveAttribute('ssA11y');
		});

		it('respects the disabled prop', () => {
			const clickFn = jest.fn();
			const rendered = render(<Checkbox disabled onClick={clickFn} />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox');

			expect(checkboxElement?.className.match(/disabled/)).toBeTruthy();
			if (checkboxElement) userEvent.click(checkboxElement);
			expect(clickFn).not.toHaveBeenCalled();
		});

		it('passes props to icon', () => {
			const icon = 'close-thin';
			const color = 'blue';
			const size = '12px';

			const rendered = render(<Checkbox checked size={size} icon={icon} color={color} />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			const svg = checkboxElement?.querySelector('svg')!;
			const path = svg.querySelector('path');

			const styles = getComputedStyle(svg);

			expect(styles.width).toBe(`calc(${size} - 30%)`);
			expect(styles.height).toBe(`calc(${size} - 30%)`);
			expect(styles.fill).toBe(color);
			expect(path).toHaveAttribute('d', iconPaths[icon]);
		});

		it('can use iconColor prop instead of color', () => {
			const icon = 'close-thin';
			const iconColor = 'blue';
			const size = '12px';

			const rendered = render(<Checkbox checked size={size} icon={icon} iconColor={iconColor} />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			const svg = checkboxElement?.querySelector('svg')!;
			const styles = getComputedStyle(svg);
			expect(styles.fill).toBe(iconColor);
		});

		it('can disableStyles', () => {
			const rendered = render(<Checkbox disableStyles />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox');

			expect(rendered.container).toBeInTheDocument();
			expect(checkboxElement?.classList.length).toBe(1);
			expect(checkboxElement?.className.match(/disabled/)).toBeFalsy();
		});

		describe('Checkbox lang works', () => {
			const selector = '.ss__checkbox';

			it('immediately available lang options', async () => {
				const langOptions = ['checkbox'];

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
						const rendered = render(<Checkbox lang={lang} />);

						const element = rendered.container.querySelector(selector);
						expect(element).toBeInTheDocument();
						const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

						expect(langElem).toBeInTheDocument();
						if (typeof langObj.value == 'function') {
							expect(valueMock).toHaveBeenCalledWith({
								checkedState: false,
								disabled: undefined,
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
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Checkbox checked />
				</ThemeProvider>
			);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			const iconElement = checkboxElement?.querySelector('.ss__icon')!;
			const iconStyles = getComputedStyle(iconElement);

			expect(checkboxElement).toHaveClass(globalTheme.components.checkbox.className);
			expect(iconStyles.fill).toBe(globalTheme.components.icon.color);
		});

		it('is themeable with theme prop', () => {
			const rendered = render(<Checkbox checked theme={propTheme} />);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			const iconElement = checkboxElement?.querySelector('.ss__icon')!;
			const iconStyles = getComputedStyle(iconElement);

			expect(checkboxElement).toHaveClass(propTheme.components.checkbox.className);
			expect(iconStyles.fill).toBe(propTheme.components.icon.color);
		});

		it('is themeable and theme prop overrides ThemeProvider', () => {
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Checkbox checked theme={propTheme} />
				</ThemeProvider>
			);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			const iconElement = checkboxElement?.querySelector('.ss__icon')!;
			const iconStyles = getComputedStyle(iconElement);

			expect(checkboxElement).toHaveClass(propTheme.components.checkbox.className);
			expect(checkboxElement).not.toHaveClass(globalTheme.components.checkbox.className);
			expect(iconStyles.fill).toBe(propTheme.components.icon.color);
		});
	});

	describe('native', () => {
		it('renders', () => {
			const rendered = render(<Checkbox native />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			const inputElement = rendered.container.querySelector('input');

			expect(rendered.container).toBeInTheDocument();
			expect(checkboxElement).toBeInTheDocument();
			expect(checkboxElement).toBe(inputElement);
			expect(checkboxElement?.className.match(/disabled/)).toBeFalsy();
			expect(inputElement).not.toHaveAttribute('disabled');
		});

		it('is not checked by default', () => {
			const rendered = render(<Checkbox native />);
			const inputElement = rendered.container.querySelector('input');

			expect(inputElement).toBeInTheDocument();
			expect(inputElement?.checked).toBe(false);
		});

		it('can handle checked state internally', () => {
			const rendered = render(<Checkbox native startChecked={true} />);
			const inputElement = rendered.container.querySelector('input');

			expect(inputElement).toBeInTheDocument();
			expect(inputElement?.checked).toBe(true);
		});

		it('does not render an icon when checked', () => {
			const rendered = render(<Checkbox native checked />);
			const svgElement = rendered.container.querySelector('svg');
			const inputElement = rendered.container.querySelector('input');

			expect(svgElement).not.toBeInTheDocument();
			expect(inputElement).toBeInTheDocument();
			expect(inputElement?.checked).toBe(true);
		});

		it('fires onClick prop when clicked', () => {
			const clickFn = jest.fn();

			const rendered = render(<Checkbox native onClick={clickFn} />);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox')!;

			userEvent.click(checkboxElement);
			expect(clickFn).toHaveBeenCalled();
		});

		it('respects the disabled prop', () => {
			const clickFn = jest.fn();
			const rendered = render(<Checkbox native disabled />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox')!;

			expect(checkboxElement.className.match(/disabled/)).toBeTruthy();
			expect(checkboxElement).toHaveAttribute('disabled');
			userEvent.click(checkboxElement);
			expect(clickFn).not.toHaveBeenCalled();
		});

		it('renders with additional style using prop', () => {
			const style = {
				padding: '20px',
			};

			const rendered = render(<Checkbox native style={style} />);
			const checkboxElement = rendered.container.querySelector('.ss__checkbox')!;
			const styles = getComputedStyle(checkboxElement);

			expect(styles.padding).toBe(style.padding);
		});

		it('is themeable with ThemeProvider', () => {
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Checkbox native />
				</ThemeProvider>
			);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			expect(checkboxElement).toHaveClass(globalTheme.components.checkbox.className);
		});

		it('is themeable with theme prop', () => {
			const rendered = render(<Checkbox native theme={propTheme} />);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			expect(checkboxElement).toHaveClass(propTheme.components.checkbox.className);
		});

		it('is themeable and theme prop overrides ThemeProvider', () => {
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Checkbox native theme={propTheme} />
				</ThemeProvider>
			);

			const checkboxElement = rendered.container.querySelector('.ss__checkbox');
			expect(checkboxElement).toHaveClass(propTheme.components.checkbox.className);
			expect(checkboxElement).not.toHaveClass(globalTheme.components.checkbox.className);
		});
	});
});
