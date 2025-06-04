import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../../../providers/theme';
import { SearchInput } from './SearchInput';

describe('SearchInput Component', () => {
	const theme = {
		components: {
			searchInput: {
				placeholderText: 'theme',
			},
		},
	};

	it('renders', () => {
		const rendered = render(<SearchInput />);
		const searchInput = rendered.container.querySelector('.ss__search-input');
		expect(searchInput).toBeInTheDocument();
	});

	it('can update placeholderText text', () => {
		const placeholderText = 'hello';
		const rendered = render(<SearchInput placeholderText={placeholderText} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();
		expect(searchInput.placeholder).toBe(placeholderText);
	});

	it('can update name attribute text', () => {
		const name = 'hello';
		const rendered = render(<SearchInput inputName={name} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();
		expect(searchInput.getAttribute('name')).toBe(name);
	});

	it('can invoke onChange callback', async () => {
		const onChangeFn = jest.fn();
		const text = 'hello world';
		const rendered = render(<SearchInput onChange={onChangeFn} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();

		await userEvent.type(searchInput, text);
		expect(searchInput.value).toBe(text);
		expect(onChangeFn).toHaveBeenCalled();
	});

	it('can change icon with icon prop', () => {
		const rendered = render(<SearchInput icon={'cog'} />);
		const searchInput = rendered.container.querySelector('.ss__search-input__input');
		expect(searchInput).toBeInTheDocument();
		const icon = rendered.container.querySelector('.ss__icon');
		expect(icon).toBeInTheDocument();
		expect(icon?.classList).toContain('ss__icon--cog');
	});

	it('can disable styling', () => {
		const rendered = render(<SearchInput />);
		const searchInput = rendered.container.querySelector('.ss__search-input');
		expect(searchInput?.classList.length).toBe(2);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<SearchInput className={className} />);
		const searchInput = rendered.container.querySelector('.ss__search-input');

		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveClass(className);
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchInput />
			</ThemeProvider>
		);

		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();

		expect(searchInput?.placeholder).toBe(theme.components.searchInput.placeholderText);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<SearchInput theme={theme} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();

		expect(searchInput.placeholder).toBe(theme.components.searchInput.placeholderText);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const componentTheme = {
			components: {
				searchInput: {
					placeholderText: 'theme 2',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchInput theme={componentTheme} />
			</ThemeProvider>
		);
		const searchInput: HTMLInputElement | null = rendered.container.querySelector('.ss__search-input__input');
		expect(searchInput).toBeInTheDocument();

		expect(searchInput?.placeholder).toBe(componentTheme.components.searchInput.placeholderText);
	});
});
