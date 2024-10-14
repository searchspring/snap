import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { List } from './List';
import { ThemeProvider } from '../../../providers';
import { ListOption } from '../../../types';

describe('List Component', () => {
	const options = [
		{
			label: 'Red',
			value: 'red',
		},
		{
			label: 'Orange',
			value: 'orange',
		},
		{
			label: 'Yellow',
			value: 'yellow',
		},
		{
			label: 'Green',
			value: 'green',
		},
		{
			label: 'Blue',
			value: 'blue',
		},
		{
			label: 'Indigo',
			value: 'indigo',
		},
		{
			label: 'Violet',
			value: 'violet',
		},
	] as ListOption[];

	const globalTheme = {
		components: {
			list: {
				className: 'classy-global',
			},
		},
	};

	const propTheme = {
		components: {
			list: {
				className: 'classy-global',
			},
		},
	};

	it('it does not render without options', () => {
		const rendered = render(<List options={[]} />);
		const element = rendered.container.querySelector('.ss__list');

		expect(element).not.toBeInTheDocument();
	});

	it('renders', () => {
		const rendered = render(<List options={options} />);
		const element = rendered.container.querySelector('.ss__list')!;

		expect(element).toBeInTheDocument();
	});

	it('renders with correct ammount of children', () => {
		const rendered = render(<List options={options} />);
		const optionElems = rendered.container.querySelectorAll('.ss__list__option');

		expect(optionElems).toHaveLength(options.length);
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<List options={options} style={style} />);
		const element = rendered.container.querySelector('.ss__list')!;

		const styles = getComputedStyle(element);

		expect(styles.padding).toBe(style.padding);
	});

	it('it fires onSelect event on option selection', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List options={options} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__list');
		const optionElements = element?.querySelectorAll('.ss__list__option')!;

		await userEvent.click(optionElements[1]);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[1], [options[1]]);
	});

	it('it adds "selected" class on selected option', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<List options={options} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__list')!;
		let optionElements = element.querySelectorAll('.ss__list__option');

		let selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).not.toBeInTheDocument();

		await userEvent.click(optionElements[selectIndex]);

		optionElements = element.querySelectorAll('.ss__list__option');

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex], [options[selectIndex]]);

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__list__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__list__option--selected');
			}
		});
	});

	it('can set selected via selected prop', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<List requireSelection={false} options={options} onSelect={selectFn} selected={options[selectIndex]} />);

		const element = rendered.container.querySelector('.ss__list')!;
		let optionElements = element.querySelectorAll('.ss__list__option');

		let selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).toBeInTheDocument();

		expect(selected?.querySelector('.ss__list__option__label')?.innerHTML).toBe(options[selectIndex].label);

		optionElements = element.querySelectorAll('.ss__list__option');

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__list__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__list__option--selected');
			}
		});

		// unselect original selection
		await userEvent.click(optionElements[selectIndex]);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex], []);

		selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).not.toBeInTheDocument();
	});

	it('can use requireSelection to prevent empty selection', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<List requireSelection={true} options={options} onSelect={selectFn} selected={options[selectIndex]} />);

		const element = rendered.container.querySelector('.ss__list')!;
		let optionElements = element.querySelectorAll('.ss__list__option');

		let selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).toBeInTheDocument();

		expect(selected?.querySelector('.ss__list__option__label')?.innerHTML).toBe(options[selectIndex].label);

		optionElements = element.querySelectorAll('.ss__list__option');

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__list__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__list__option--selected');
			}
		});

		// fail to unselect original selection
		await userEvent.click(optionElements[selectIndex]);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex], [options[selectIndex]]);

		selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).toBeInTheDocument();
	});

	it('uses label when passed, and value if not', async () => {
		const selectFn = jest.fn();
		const options2 = [
			{
				label: 'Red',
				value: 'red',
			},
			{
				value: 'orange',
			},
		];

		const rendered = render(<List options={options2} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__list')!;
		let optionElements = element.querySelectorAll('.ss__list__option');

		expect(optionElements[0]?.querySelector('.ss__list__option__label')?.innerHTML).toBe(options[0].label);
		expect(optionElements[1]?.querySelector('.ss__list__option__label')?.innerHTML).toBe(options[1].value);
	});

	it('it can be disabled', async () => {
		const rendered = render(<List disabled={true} options={options} />);

		const element = rendered.container?.querySelector('.ss__list--disabled')!;

		expect(element).toBeInTheDocument();
		const styles = getComputedStyle(element);
		expect(styles.pointerEvents).toBe('none');
	});

	it('it can use multi-select with prop', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List multiSelect={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option');

		expect(optionElements[0]).toBeInTheDocument();
		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[0]);

		expect(optionElements[0]).toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[1]);

		expect(optionElements[0]).toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[0]);

		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[1]);

		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');
	});

	it('it does not use multi-select by default', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option');

		expect(optionElements[0]).toBeInTheDocument();
		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[0]);

		expect(optionElements[0]).toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[1]);

		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[0]);

		expect(optionElements[0]).toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');
	});

	it('it use native prop to render native checkbox elements', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List native={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option')[0]!;

		const checkbox = rendered.container.querySelector('.ss__checkbox');

		expect(optionElements).toBeInTheDocument();
		expect(checkbox).toBeInTheDocument();

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0], [options[0]]);
	});

	it('it can hideOptionCheckboxes', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List hideOptionCheckboxes={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option')[0]!;

		expect(optionElements).toBeInTheDocument();

		expect(optionElements.innerHTML).toBe(`<label class=\"ss__list__option__label\">${options[0].label}</label>`);

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0], [options[0]]);
	});

	it('it can hideOptionLabels', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List hideOptionLabels={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option')[0]!;
		const label = rendered.container.querySelector('.ss__list__option__label');

		expect(label).not.toBeInTheDocument();
		expect(optionElements).toBeInTheDocument();

		expect(optionElements.innerHTML).toBe(
			`<span class=\"ss__checkbox ss-1mgplc8\" role=\"checkbox\" aria-checked=\"false\" ss-lang=\"checkbox\" aria-label=\" unchecked checkbox\"><span class=\"ss__checkbox__empty\"></span></span>`
		);

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0], [options[0]]);
	});

	it('it can render Icon options', async () => {
		const selectFn = jest.fn();

		const iconOptions: ListOption[] = [
			{
				label: '1 wide',
				value: '1 wide',
				icon: 'square',
			},
			{
				label: '2 wide',
				value: '2 wide',
				icon: {
					icon: 'layout-large',
				},
			},
			{
				label: '3 wide',
				value: '3 wide',
				icon: {
					icon: 'layout-grid',
				},
			},
		];

		const rendered = render(<List options={iconOptions} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option')[0]!;
		const label = rendered.container.querySelector('.ss__list__option__label');
		const icon = rendered.container.querySelector('.ss__list__option__icon');

		expect(label).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
		expect(icon?.classList.contains('ss__icon--square')).toBe(true);

		expect(optionElements).toBeInTheDocument();

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), iconOptions[0], [iconOptions[0]]);
	});

	it('it can hide Icon options', async () => {
		const selectFn = jest.fn();

		const iconOptions: ListOption[] = [
			{
				label: '1 wide',
				value: '1 wide',
				icon: 'square',
			},
			{
				label: '2 wide',
				value: '2 wide',
				icon: {
					icon: 'layout-large',
				},
			},
			{
				label: '3 wide',
				value: '3 wide',
				icon: {
					icon: 'layout-grid',
				},
			},
		];

		const rendered = render(<List hideOptionIcons={true} options={iconOptions} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option')[0]!;
		const label = rendered.container.querySelector('.ss__list__option__label');
		const icon = rendered.container.querySelector('.ss__list__option__icon');

		expect(label).toBeInTheDocument();
		expect(icon).not.toBeInTheDocument();

		expect(optionElements).toBeInTheDocument();

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), iconOptions[0], [iconOptions[0]]);
	});

	it('renders the titleText', () => {
		const title = 'My Title';
		const rendered = render(<List titleText={title} options={options} />);

		const titleElem = rendered.container.querySelector('.ss__list__title');

		expect(titleElem).toHaveTextContent(title);
	});

	it('can hide the titleText', () => {
		const title = 'My Title';
		const rendered = render(<List hideTitleText={true} titleText={title} options={options} />);

		const titleElem = rendered.container.querySelector('.ss__list__title');

		expect(titleElem).not.toBeInTheDocument();
	});

	describe('List lang works', () => {
		const selector = '.ss__list';

		it('immediately available lang options', async () => {
			const langOptions = ['title'];

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

					let valueSatisfied = false;
					let altSatisfied = false;
					let labelSatisfied = false;
					let valueTextSatisfied = false;
					let titleSatisfied = false;

					// @ts-ignore
					const rendered = render(<List options={options} lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
					expect(langElems.length).toBeGreaterThan(0);
					langElems.forEach((elem) => {
						if (typeof langObj.value == 'function') {
							expect(valueMock).toHaveBeenCalledWith({
								options: options,
								selectedOptions: [],
							});

							if (elem?.innerHTML == value) {
								valueSatisfied = true;
							}
						} else {
							if (elem?.innerHTML == langObj.value) {
								valueSatisfied = true;
							}
						}

						if (elem.getAttribute('alt') == altText) {
							altSatisfied = true;
						}
						if (elem.getAttribute('aria-label') == ariaLabel) {
							labelSatisfied = true;
						}
						if (elem.getAttribute('aria-valuetext') == ariaValueText) {
							valueTextSatisfied = true;
						}
						if (elem.getAttribute('title') == title) {
							titleSatisfied = true;
						}
					});

					expect(valueSatisfied).toBeTruthy();
					expect(altSatisfied).toBeTruthy();
					expect(labelSatisfied).toBeTruthy();
					expect(valueTextSatisfied).toBeTruthy();
					expect(titleSatisfied).toBeTruthy();

					jest.restoreAllMocks();
				});
			});
		});
	});

	it('can disableStyles', () => {
		const rendered = render(<List disableStyles options={options} />);

		const element = rendered.container.querySelector('.ss__list');

		expect(element?.classList).toHaveLength(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<List options={options} className={className} />);

		const element = rendered.container.querySelector('.ss__list');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<List options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__list')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.list.className);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<List options={options} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__list')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.list.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<List theme={propTheme} options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__list')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.list.className);
	});
});
