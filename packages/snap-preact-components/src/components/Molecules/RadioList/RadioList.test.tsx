import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { RadioList } from './RadioList';
import { ThemeProvider } from '../../../providers';
import { ListOption } from '../../../types';

describe('RadioList Component', () => {
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
			radioList: {
				className: 'classy-global',
			},
		},
	};

	const propTheme = {
		components: {
			radioList: {
				className: 'classy-global',
			},
		},
	};

	it('it does not render without options', () => {
		const rendered = render(<RadioList options={[]} />);
		const element = rendered.container.querySelector('.ss__radio-list');

		expect(element).not.toBeInTheDocument();
	});

	it('renders', () => {
		const rendered = render(<RadioList options={options} />);
		const element = rendered.container.querySelector('.ss__radio-list')!;

		expect(element).toBeInTheDocument();
	});

	it('renders with correct ammount of children', () => {
		const rendered = render(<RadioList options={options} />);
		const optionElems = rendered.container.querySelectorAll('.ss__radio-list__option');

		expect(optionElems).toHaveLength(options.length);
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<RadioList options={options} style={style} />);
		const element = rendered.container.querySelector('.ss__radio-list')!;

		const styles = getComputedStyle(element);

		expect(styles.padding).toBe(style.padding);
	});

	it('it fires onSelect event on option selection', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioList options={options} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__radio-list');
		const optionElements = element?.querySelectorAll('.ss__radio-list__option')!;

		await userEvent.click(optionElements[1]);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[1]);
	});

	it('it adds "selected" class on selected option', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<RadioList options={options} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__radio-list')!;
		let optionElements = element.querySelectorAll('.ss__radio-list__option');

		let selected = rendered.container.querySelector('.ss__radio-list__option--selected');

		expect(selected).not.toBeInTheDocument();

		await userEvent.click(optionElements[selectIndex]);

		optionElements = element.querySelectorAll('.ss__radio-list__option');

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex]);

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__radio-list__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__radio-list__option--selected');
			}
		});
	});

	it('can set selected via selected prop', async () => {
		const selectFn = jest.fn();
		const selectIndex = 1;

		const rendered = render(<RadioList options={options} onSelect={selectFn} selected={options[1].value} />);

		const element = rendered.container.querySelector('.ss__radio-list')!;
		let optionElements = element.querySelectorAll('.ss__radio-list__option');

		let selected = rendered.container.querySelector('.ss__radio-list__option--selected');

		expect(selected).toBeInTheDocument();

		expect(selected?.querySelector('.ss__radio-list__option__label')?.innerHTML).toBe(options[1].label);

		await userEvent.click(optionElements[selectIndex]);

		optionElements = element.querySelectorAll('.ss__radio-list__option');

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[selectIndex]);

		optionElements.forEach((optionElement, index) => {
			if (index != selectIndex) {
				expect(optionElement).not.toHaveClass('ss__radio-list__option--selected');
			} else {
				expect(optionElement).toHaveClass('ss__radio-list__option--selected');
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

		const rendered = render(<RadioList options={options2} onSelect={selectFn} />);

		const element = rendered.container.querySelector('.ss__radio-list')!;
		let optionElements = element.querySelectorAll('.ss__radio-list__option');

		expect(optionElements[0]?.querySelector('.ss__radio-list__option__label')?.innerHTML).toBe(options[0].label);
		expect(optionElements[1]?.querySelector('.ss__radio-list__option__label')?.innerHTML).toBe(options[1].value);
	});

	it('it can be disabled', async () => {
		const rendered = render(<RadioList disabled={true} options={options} />);

		const element = rendered.container?.querySelector('.ss__radio-list--disabled')!;
		expect(element).toBeInTheDocument();
		const styles = getComputedStyle(element);
		expect(styles.pointerEvents).toBe('none');
	});

	it('it can hideRadios', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioList hideOptionRadios={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__radio-list__option')[0]!;

		expect(optionElements).toBeInTheDocument();

		expect(optionElements.innerHTML).toBe(`<label class=\"ss__radio-list__option__label\">${options[0].label}</label>`);

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0]);
	});

	it('it can hideLabels', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioList hideOptionLabels={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__radio-list__option')[0]!;
		const label = rendered.container.querySelector('.ss__radio-list__option__label');

		expect(label).not.toBeInTheDocument();
		expect(optionElements).toBeInTheDocument();

		expect(optionElements.innerHTML).toBe(
			`<span class=\"ss__radio ss__radio-list__option__radio ss-stz164-I\" aria-label=\" unchecked checkbox\" role=\"radio\"><svg class=\"ss__icon ss__icon--bullet-o ss__radio__icon--inactive ss-3t6diw-I\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\" theme=\"[object Object]\" name=\"ss__radio__icon--inactive\"><circle cx=\"28\" cy=\"28\" r=\"20\" stroke-width=\"3\" fill=\"white\"></circle></svg></span>`
		);

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0]);
	});

	it('it can render Icon options', async () => {
		const selectFn = jest.fn();

		const iconOptions = [
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

		const rendered = render(<RadioList options={iconOptions} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__radio-list__option')[0]!;
		const label = rendered.container.querySelector('.ss__radio-list__option__label');
		const icon = rendered.container.querySelector('.ss__radio-list__option__icon');

		expect(label).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
		expect(icon?.classList.contains('ss__icon--square')).toBe(true);

		expect(optionElements).toBeInTheDocument();

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), iconOptions[0]);
	});

	it('it can hide Icon options', async () => {
		const selectFn = jest.fn();

		const iconOptions = [
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

		const rendered = render(<RadioList hideOptionIcons={true} options={iconOptions} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__radio-list__option')[0]!;
		const label = rendered.container.querySelector('.ss__radio-list__option__label');
		const icon = rendered.container.querySelector('.ss__radio-list__option__icon');

		expect(label).toBeInTheDocument();
		expect(icon).not.toBeInTheDocument();

		expect(optionElements).toBeInTheDocument();

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), iconOptions[0]);
	});

	it('it can use native prop to render native radios', async () => {
		const selectFn = jest.fn();

		const rendered = render(<RadioList native={true} options={options} onSelect={selectFn} />);

		const optionElements = rendered.container?.querySelectorAll('.ss__radio-list__option__radio input')[0]!;

		expect(optionElements).toBeInTheDocument();

		expect(optionElements).toHaveAttribute('type', 'radio');

		await userEvent.click(optionElements);

		expect(selectFn).toHaveBeenCalledWith(expect.anything(), options[0]);
	});

	it('renders the titleText', () => {
		const title = 'My Title';
		const rendered = render(<RadioList titleText={title} options={options} />);

		const titleElem = rendered.container.querySelector('.ss__radio-list__title');

		expect(titleElem).toHaveTextContent(title);
	});

	it('can disableStyles', () => {
		const rendered = render(<RadioList disableStyles options={options} />);

		const element = rendered.container.querySelector('.ss__radio-list');

		expect(element?.classList).toHaveLength(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<RadioList options={options} className={className} />);

		const element = rendered.container.querySelector('.ss__radio-list');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<RadioList options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__radio-list')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.radioList.className);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<RadioList options={options} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__radio-list')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.radioList.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<RadioList theme={propTheme} options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__radio-list')!;

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.radioList.className);
	});
});
