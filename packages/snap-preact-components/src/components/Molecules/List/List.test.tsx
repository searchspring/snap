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

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[1], [options[1].value]);
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

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex], [options[selectIndex].value]);

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

		const rendered = render(<List options={options} onSelect={selectFn} selected={options[1].value} />);

		const element = rendered.container.querySelector('.ss__list')!;
		let optionElements = element.querySelectorAll('.ss__list__option');

		let selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).toBeInTheDocument();

		expect(selected?.querySelector('.ss__list__option__label')?.innerHTML).toBe(options[1].label);

		optionElements = element.querySelectorAll('.ss__list__option');

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__list__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__list__option--selected');
			}
		});

		await userEvent.click(optionElements[selectIndex]);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex], []);

		selected = rendered.container.querySelector('.ss__list__option--selected');

		expect(selected).not.toBeInTheDocument();
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

	it('it can multi-select', async () => {
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

		expect(optionElements[0]).toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[0]);

		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).toHaveClass('ss__list__option--selected');

		await userEvent.click(optionElements[1]);

		expect(optionElements[0]).not.toHaveClass('ss__list__option--selected');
		expect(optionElements[1]).not.toHaveClass('ss__list__option--selected');
	});

	it('it can turn off multi-select', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List multiSelect={false} options={options} onSelect={selectFn} />);

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

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0], [options[0].value]);
	});

	it('it can hideCheckbox', async () => {
		const selectFn = jest.fn();

		const rendered = render(<List hideCheckbox={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__list__option')[0]!;

		expect(optionElements).toBeInTheDocument();

		expect(optionElements.innerHTML).toBe(`<label class=\"ss__list__option__label\">${options[0].label}</label>`);

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0], [options[0].value]);
	});

	it('renders the titleText', () => {
		const title = 'My Title';
		const rendered = render(<List titleText={title} options={options} />);

		const titleElem = rendered.container.querySelector('.ss__list__title');

		expect(titleElem).toHaveTextContent(title);
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
