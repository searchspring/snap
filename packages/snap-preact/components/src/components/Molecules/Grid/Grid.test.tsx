import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';
import { Grid } from './Grid';
import { GridLang } from './Grid';

const options = [
	{
		value: 'one',
		disabled: true,
	},
	{
		value: 'two',
	},
	{
		value: 'three',
	},
	{
		value: 'four',
	},
	{
		value: 'five',
	},
	{
		value: 'six',
	},
	{
		value: 'seven',
	},
	{
		value: 'eight',
	},
];

describe('Grid Component', () => {
	let gridComponent;
	let gridElement;

	it('renders', () => {
		gridComponent = render(<Grid options={options} />);

		gridElement = gridComponent.container.querySelector('.ss__grid');

		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveTextContent(options[0].value!);
	});

	it('has the correct number of options', () => {
		gridComponent = render(<Grid options={options} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__grid__option');
		expect(gridOptions).toHaveLength(options.length);
	});

	it('has the correct label', () => {
		gridComponent = render(<Grid options={options} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__grid__option__label');
		for (let i = 0; i < gridOptions.length; i++) {
			expect(gridOptions[i]).toHaveTextContent(options[i].value!);
		}
	});

	it('can hide the labels with hideLabels', () => {
		gridComponent = render(<Grid options={options} hideLabels={true} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__grid__option');

		expect(gridOptions).toHaveLength(options.length);

		const gridOptionLabels = gridComponent.container.querySelector('.ss__grid__option__label');
		expect(gridOptionLabels).not.toBeInTheDocument();
	});

	it('can add a title with titleText', () => {
		const title = 'title text';
		gridComponent = render(<Grid options={options} titleText={title} />);

		const titleElem = gridComponent.container.querySelector('.ss__grid__title');
		expect(titleElem).toBeInTheDocument();
		expect(titleElem).toHaveTextContent(title);
	});

	it('can multiSelect', async () => {
		gridComponent = render(<Grid options={options} multiSelect={true} />);

		const optionElems = gridComponent.container.querySelectorAll('.ss__grid__option');

		let selectedOptions = gridComponent.container.querySelectorAll('.ss__grid__option--selected');

		expect(selectedOptions.length).toBe(0);

		await userEvent.click(optionElems[1]);

		selectedOptions = gridComponent.container.querySelectorAll('.ss__grid__option--selected');

		expect(selectedOptions.length).toBe(1);

		expect(selectedOptions[0]).toHaveTextContent(options[1].value);

		await userEvent.click(optionElems[2]);

		selectedOptions = gridComponent.container.querySelectorAll('.ss__grid__option--selected');

		expect(selectedOptions.length).toBe(2);
	});

	it('can pass an onSelect func', async () => {
		const myFunc = jest.fn();

		gridComponent = render(<Grid options={options} onSelect={myFunc} />);

		const optionElems = gridComponent.container.querySelectorAll('.ss__grid__option');

		let selectedOptions = gridComponent.container.querySelectorAll('.ss__grid__option--selected');

		expect(selectedOptions.length).toBe(0);
		expect(myFunc).not.toHaveBeenCalled();

		await userEvent.click(optionElems[1]);

		selectedOptions = gridComponent.container.querySelectorAll('.ss__grid__option--selected');

		expect(selectedOptions.length).toBe(1);

		expect(selectedOptions[0]).toHaveTextContent(options[1].value);

		expect(myFunc).toHaveBeenCalled();
	});

	it('disabled Grid option elements have correct classes', () => {
		gridComponent = render(<Grid options={options} />);

		const gridOptionsElement = gridComponent.container.querySelector('.ss__grid__option--disabled');
		expect(gridOptionsElement).toBeInTheDocument();
		expect(gridOptionsElement).toHaveTextContent(options[0].value);
	});

	it('can adjust gapSize & columns', () => {
		const args = {
			gapSize: '10px',
			columns: 2,
		};

		const rendered = render(<Grid options={options} {...args} />);

		const gridOptionsElement = rendered.container.querySelector('.ss__grid__options')!;

		const styles = getComputedStyle(gridOptionsElement);
		expect(styles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(styles.gap).toBe(args.gapSize);
	});

	it('can set rows, and use overflow button', async () => {
		const args = {
			gapSize: '10px',
			columns: 2,
			rows: 2,
		};

		const rendered = render(<Grid options={options} {...args} />);

		const gridOptionsElement = rendered.container.querySelector('.ss__grid__options')!;

		const styles = getComputedStyle(gridOptionsElement);
		expect(styles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(styles.gap).toBe(args.gapSize);

		let optionElems = rendered.container.querySelectorAll('.ss__grid__option');
		let overflowButton = rendered.container.querySelector('.ss__grid__show-more-wrapper');

		expect(optionElems).toHaveLength(args.columns * args.rows);
		expect(overflowButton).toBeInTheDocument();
		expect(overflowButton).toHaveTextContent(`+ ${options.length - args.columns * args.rows}`);

		await userEvent.click(overflowButton!);

		optionElems = rendered.container.querySelectorAll('.ss__grid__option');
		overflowButton = rendered.container.querySelector('.ss__grid__show-more-wrapper');

		expect(optionElems).toHaveLength(options.length);
		expect(overflowButton).toBeInTheDocument();
		expect(overflowButton).toHaveTextContent(`Less`);
	});

	it('can disableOverflowAction, and set overflowButtonInGrid', async () => {
		const args = {
			gapSize: '10px',
			columns: 2,
			rows: 2,
			overflowButtonInGrid: true,
			disableOverflowAction: true,
		};

		const rendered = render(<Grid options={options} {...args} />);

		const gridOptionsElement = rendered.container.querySelector('.ss__grid__options')!;

		const styles = getComputedStyle(gridOptionsElement);
		expect(styles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(styles.gap).toBe(args.gapSize);

		let optionElems = rendered.container.querySelectorAll('.ss__grid__option');
		let overflowButton = rendered.container.querySelector('.ss__grid__show-more-wrapper');

		expect(optionElems).toHaveLength(args.columns * args.rows);
		expect(overflowButton).toBeInTheDocument();
		expect(overflowButton).toHaveClass('ss__grid__option');

		await userEvent.click(overflowButton!);

		optionElems = rendered.container.querySelectorAll('.ss__grid__option');
		expect(optionElems).toHaveLength(args.columns * args.rows);
	});

	it('can use custom overflow button', async () => {
		const func = jest.fn();
		const CustomButton = () => <div className="custom">custom</div>;
		const args = {
			gapSize: '10px',
			columns: 2,
			rows: 2,
			overflowButton: <CustomButton />,
			onOverflowButtonClick: func,
		};

		const rendered = render(<Grid options={options} {...args} />);

		const gridOptionsElement = rendered.container.querySelector('.ss__grid__options')!;

		const styles = getComputedStyle(gridOptionsElement);
		expect(styles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(styles.gap).toBe(args.gapSize);

		let optionElems = rendered.container.querySelectorAll('.ss__grid__option');
		let overflowButton = rendered.container.querySelector('.custom');

		expect(optionElems).toHaveLength(args.columns * args.rows);
		expect(overflowButton).toBeInTheDocument();
		expect(overflowButton).toHaveTextContent(`custom`);

		await userEvent.click(overflowButton!);

		expect(func).toHaveBeenCalled();
	});

	it('can disable styling', () => {
		const rendered = render(<Grid options={options} disableStyles={true} />);

		const gridElement = rendered.container.querySelector('.ss__grid');
		expect(gridElement?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Grid options={options} className={className} />);

		const gridElement = rendered.container.querySelector('.ss__grid');
		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveClass(className);
	});
});

describe('Grid lang works', () => {
	const selector = '.ss__grid';

	it('immediately available lang options', async () => {
		const langOptions = ['showMoreText'];

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
				const lang: Partial<GridLang> = {
					[`${option}`]: langObj,
				};

				let valueSatified = false;
				let altSatified = false;
				let labelSatified = false;
				let valueTextSatified = false;
				let titleSatified = false;

				// @ts-ignore
				const rendered = render(<Grid options={options} lang={lang} columns={2} rows={2} />);

				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();

				const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
				expect(langElems.length).toBeGreaterThan(0);
				langElems.forEach((elem) => {
					if (typeof langObj.value == 'function') {
						expect(valueMock).toHaveBeenCalledWith({
							limited: 4,
							remainder: 4,
						});

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

	it('custom lang options', async () => {
		const lessValue = 'less value';
		const lessAltText = 'less alt';
		const lessAriaLabel = 'less label';
		const lessAriaValueText = 'less value text';
		const lessTitle = 'less title';

		const valueMock = jest.fn(() => lessValue);
		const altMock = jest.fn(() => lessAltText);
		const labelMock = jest.fn(() => lessAriaLabel);
		const valueTextMock = jest.fn(() => lessAriaValueText);
		const titleMock = jest.fn(() => lessTitle);

		const langObjs = [
			{
				value: lessValue,
				attributes: {
					alt: lessAltText,
					'aria-label': lessAriaLabel,
					'aria-valuetext': lessAriaValueText,
					title: lessTitle,
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
				value: `<div>${lessValue}</div>`,
				attributes: {
					alt: lessAltText,
					'aria-label': lessAriaLabel,
					'aria-valuetext': lessAriaValueText,
					title: lessTitle,
				},
			},
		];

		let valueSatified = false;
		let altSatified = false;
		let labelSatified = false;
		let valueTextSatified = false;
		let titleSatified = false;

		langObjs.forEach(async (langObj) => {
			const lang = {
				[`showLessText`]: langObj,
			};

			// @ts-ignore
			const rendered = render(<Grid options={options} lang={lang} columns={2} rows={2} />);

			const element = rendered.container.querySelector(selector);
			expect(element).toBeInTheDocument();

			let overflowButton = rendered.container.querySelector('.ss__grid__show-more-wrapper');

			await userEvent.click(overflowButton!);

			const lessElems = rendered.container.querySelectorAll(`[ss-lang=showLessText]`);

			expect(lessElems.length).toBeGreaterThan(0);
			lessElems.forEach((elem) => {
				if (typeof langObj.value == 'function') {
					expect(valueMock).toHaveBeenCalledWith({
						limited: 4,
						remainder: 4,
					});

					if (elem?.innerHTML == lessValue) {
						valueSatified = true;
					}
				} else {
					if (elem?.innerHTML == langObj.value) {
						valueSatified = true;
					}
				}

				if (elem.getAttribute('alt') == lessAltText) {
					altSatified = true;
				}
				if (elem.getAttribute('aria-label') == lessAriaLabel) {
					labelSatified = true;
				}
				if (elem.getAttribute('aria-valuetext') == lessAriaValueText) {
					valueTextSatified = true;
				}
				if (elem.getAttribute('title') == lessTitle) {
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

describe('Grid theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				grid: {
					gapSize: '10px',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Grid options={options} />
			</ThemeProvider>
		);
		const gridElement = rendered.container.querySelector('.ss__grid__options')!;
		const styles = getComputedStyle(gridElement);
		expect(styles.gap).toBe(globalTheme.components.grid.gapSize);
		expect(gridElement).toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				grid: {
					gapSize: '10px',
				},
			},
		};
		const rendered = render(<Grid options={options} theme={propTheme} />);
		const gridElement = rendered.container.querySelector('.ss__grid__options')!;
		const styles = getComputedStyle(gridElement);
		expect(styles.gap).toBe(propTheme.components.grid.gapSize);
		expect(gridElement).toBeInTheDocument();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				grid: {
					gapSize: '10px',
				},
			},
		};
		const propTheme = {
			components: {
				grid: {
					gapSize: '15px',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Grid options={options} theme={propTheme} />
			</ThemeProvider>
		);
		const gridElement = rendered.container.querySelector('.ss__grid__options')!;
		const styles = getComputedStyle(gridElement);
		expect(styles.gap).toBe(propTheme.components.grid.gapSize);
		expect(gridElement).toBeInTheDocument();
	});
});
