import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { Theme, ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';
import { LayoutSelector } from './LayoutSelector';
import { layoutOption } from '../../../types';

describe('LayoutSelector Component', () => {
	const options: layoutOption[] = [
		{
			label: '1 wide',
			value: {
				icon: 'square',
				columns: 1,
			},
		},
		{
			label: '2 wide',
			value: {
				icon: {
					icon: 'layout-large',
				},
				columns: 2,
			},
		},
		{
			label: '3 wide',
			value: {
				icon: {
					icon: 'layout-grid',
				},
				columns: 3,
			},
		},
		{
			label: '4 wide',
			value: {
				columns: 4,
			},
		},
		{
			label: 'custom',
			value: {
				component: (props) => <div className="custom">custom</div>,
			},
		},
	];

	let onSelect = jest.fn();

	it('it doesnt render without options', () => {
		// @ts-ignore
		const rendered = render(<LayoutSelector />);

		const element = rendered.container.querySelector('.ss__layout__select');

		expect(element).not.toBeInTheDocument();
	});

	it('it renders with options & onSelect', () => {
		const rendered = render(<LayoutSelector options={options} onSelect={onSelect} />);

		const element = rendered.container.querySelector('.ss__layout__select');

		expect(element).toBeInTheDocument();
	});

	it('can set custom onselect', async () => {
		let func = jest.fn();
		const rendered = render(<LayoutSelector type={'list'} options={options} onSelect={func} />);

		const element = rendered.container.querySelector('.ss__layout__list li');

		expect(element).toBeInTheDocument();

		userEvent.click(element!);

		await waitFor(() => {
			expect(func).toHaveBeenCalledWith(expect.anything(), options[0]);
		});
	});

	it('it renders with a label', () => {
		const label = 'my label';
		const rendered = render(<LayoutSelector onSelect={onSelect} label={label} options={options} />);

		const element = rendered.container.querySelector('.ss__layout__select');
		const labelElem = rendered.container.querySelector('.ss__select__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).toBeInTheDocument();
		expect(labelElem?.textContent).toBe(`${label}: `);
	});

	it('it renders as a dropdown type', () => {
		const rendered = render(<LayoutSelector onSelect={onSelect} type={'dropdown'} options={options} />);
		const element = rendered.container.querySelector('.ss__layout__select');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a list type', () => {
		const rendered = render(<LayoutSelector onSelect={onSelect} type={'list'} options={options} />);
		const element = rendered.container.querySelector('.ss__layout__list.ss__list');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a Radio type', () => {
		const rendered = render(<LayoutSelector onSelect={onSelect} type={'radio'} options={options} />);
		rendered.debug();
		const element = rendered.container.querySelector('.ss__radio-list.ss__layout__radioList');
		expect(element).toBeInTheDocument();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<LayoutSelector onSelect={onSelect} options={options} className={className} />);

		const element = rendered.container.querySelector('.ss__layout__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<LayoutSelector onSelect={onSelect} options={options} disableStyles />);

		const element = rendered.container.querySelector('.ss__layout__select');

		expect(element?.classList).toHaveLength(2);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				layoutSelector: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<LayoutSelector onSelect={onSelect} options={options} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__layout__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.layoutSelector.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				layoutSelector: {
					className: 'classy',
				},
			},
		} as Theme;
		const rendered = render(<LayoutSelector onSelect={onSelect} options={options} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__layout__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components?.layoutSelector?.className!);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				layoutSelector: {
					className: 'classy',
				},
			},
		};
		const propTheme = {
			components: {
				layoutSelector: {
					className: 'notClassy',
				},
			},
		} as Theme;

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<LayoutSelector onSelect={onSelect} options={options} theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__layout__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components?.layoutSelector?.className!);
		expect(element).not.toHaveClass(globalTheme.components.layoutSelector.className);
	});
});
