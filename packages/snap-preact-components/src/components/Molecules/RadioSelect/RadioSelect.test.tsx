import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { RadioSelect } from './RadioSelect';
import { ThemeProvider } from '../../../providers';
import { Option } from '../Select';

describe('RadioSelect Component', () => {
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
	] as Option[];

	const globalTheme = {
		components: {
			radioSelect: {
				className: 'classy-global',
			},
		},
	};

	const propTheme = {
		components: {
			radioSelect: {
				className: 'classy-global',
			},
		},
	};

	it('it does not render without options', () => {
		const rendered = render(<RadioSelect options={[]} />);
		const element = rendered.container.querySelector('.ss__radio-select');

		expect(element).not.toBeInTheDocument();
	});

	it('renders', () => {
		const rendered = render(<RadioSelect options={options} />);
		const element = rendered.container.querySelector('.ss__radio-select')!;

		expect(element).toBeInTheDocument();
	});

	it('renders with correct ammount of children', () => {
		const rendered = render(<RadioSelect options={options} />);
		const optionElems = rendered.container.querySelectorAll('.ss__radio-select__option');

		expect(optionElems).toHaveLength(options.length);
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<RadioSelect options={options} style={style} />);
		const element = rendered.container.querySelector('.ss__radio-select')!;

		const styles = getComputedStyle(element);

		expect(styles.padding).toBe(style.padding);
	});

	//todo - maybe a good test for when we update the icon code
	// it('can change the icons in the theme', async () => {
	// });

	it('it fires onSelect event on option selection', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioSelect options={options} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__radio-select');
		const optionElements = element?.querySelectorAll('.ss__radio-select__option')!;

		await userEvent.click(optionElements[1]);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[1]);
	});

	it('it adds "selected" class on selected option', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<RadioSelect options={options} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__radio-select')!;
		let optionElements = element.querySelectorAll('.ss__radio-select__option');

		let selected = rendered.container.querySelector('.ss__radio-select__option--selected');

		expect(selected).not.toBeInTheDocument();

		await userEvent.click(optionElements[selectIndex]);

		optionElements = element.querySelectorAll('.ss__radio-select__option');

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex]);

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__radio-select__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__radio-select__option--selected');
			}
		});
	});

	it('can set selected via selected prop', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<RadioSelect options={options} onSelect={selectFn} selected={options[1].value} />);

		const element = rendered.container.querySelector('.ss__radio-select')!;
		let optionElements = element.querySelectorAll('.ss__radio-select__option');

		let selected = rendered.container.querySelector('.ss__radio-select__option--selected');

		expect(selected).toBeInTheDocument();

		expect(selected?.querySelector('.ss__radio-select__option__label')?.innerHTML).toBe(options[1].label);

		await userEvent.click(optionElements[selectIndex]);

		optionElements = element.querySelectorAll('.ss__radio-select__option');

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex]);

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__radio-select__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__radio-select__option--selected');
			}
		});
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

		const rendered = render(<RadioSelect options={options2} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__radio-select')!;
		let optionElements = element.querySelectorAll('.ss__radio-select__option');

		expect(optionElements[0]?.querySelector('.ss__radio-select__option__label')?.innerHTML).toBe(options[0].label);
		expect(optionElements[1]?.querySelector('.ss__radio-select__option__label')?.innerHTML).toBe(options[1].value);
	});

	it('it can be disabled', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioSelect disabled={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelector('.ss__radio-select__option--disabled')!;

		expect(optionElements).toBeInTheDocument();

		await userEvent.click(optionElements);

		expect(selectFn).not.toHaveBeenCalledWith(expect.anything(), options[1]);
	});

	it('it can hideRadios', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioSelect hideRadios={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__radio-select__option')[0]!;

		expect(optionElements).toBeInTheDocument();

		expect(optionElements.innerHTML).toBe(`<label class=\"ss__radio-select__option__label\">${options[0].label}</label>`);

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0]);
	});

	it('it can use native prop to render native radios', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioSelect native={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('input.ss__radio-select__option__radio')[0]!;

		expect(optionElements).toBeInTheDocument();

		expect(optionElements).toHaveAttribute('type', 'radio');

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0]);
	});

	it('renders the titleText', () => {
		const title = 'My Title';
		const rendered = render(<RadioSelect titleText={title} options={options} />);

		const titleElem = rendered.container.querySelector('.ss__radio-select__title');

		expect(titleElem).toHaveTextContent(title);
	});

	it('can disableStyles', () => {
		const rendered = render(<RadioSelect disableStyles options={options} />);

		const element = rendered.container.querySelector('.ss__radio-select');

		expect(element?.classList).toHaveLength(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<RadioSelect options={options} className={className} />);

		const element = rendered.container.querySelector('.ss__radio-select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<RadioSelect options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__radio-select')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.radioSelect.className);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<RadioSelect options={options} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__radio-select')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.radioSelect.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<RadioSelect theme={propTheme} options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__radio-select')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.radioSelect.className);
	});
});
