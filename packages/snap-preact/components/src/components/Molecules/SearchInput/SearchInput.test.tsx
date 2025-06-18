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
		const rendered = render(<SearchInput value={''} />);
		const searchInput = rendered.container.querySelector('.ss__search-input');
		expect(searchInput).toBeInTheDocument();
	});

	it('can update placeholderText text', () => {
		const placeholderText = 'hello';
		const rendered = render(<SearchInput value={''} placeholderText={placeholderText} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();
		expect(searchInput.placeholder).toBe(placeholderText);
	});

	it('can update name attribute text', () => {
		const name = 'hello';
		const rendered = render(<SearchInput value={''} inputName={name} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();
		expect(searchInput.getAttribute('name')).toBe(name);
	});

	it('can invoke onChange callback', async () => {
		const onChangeFn = jest.fn();
		const text = 'hello world';
		const rendered = render(<SearchInput value={''} onChange={onChangeFn} />);
		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();

		await userEvent.type(searchInput, text);
		expect(searchInput.value).toBe(text);
		expect(onChangeFn).toHaveBeenCalled();
	});

	it('can change icon with icon prop', () => {
		const rendered = render(<SearchInput value={''} searchIcon={'cog'} />);
		const searchInput = rendered.container.querySelector('.ss__search-input__input');
		expect(searchInput).toBeInTheDocument();
		const icon = rendered.container.querySelector('.ss__icon');
		expect(icon).toBeInTheDocument();
		expect(icon?.classList).toContain('ss__icon--cog');
	});

	it('can disable styling', () => {
		const rendered = render(<SearchInput value={''} />);
		const searchInput = rendered.container.querySelector('.ss__search-input');
		expect(searchInput?.classList.length).toBe(2);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<SearchInput value={''} className={className} />);
		const searchInput = rendered.container.querySelector('.ss__search-input');

		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveClass(className);
	});

	it('renders with search icon by default', async () => {
		const func = jest.fn();
		const rendered = render(<SearchInput value={''} onSearchIconClick={func} />);
		const searchButton = rendered.container.querySelector('.ss__search-input__button--search-icon');
		const searchButtonIcon = rendered.container.querySelector('.ss__search-input__button--search-icon .ss__icon--search.ss__button__icon');

		expect(searchButton).toBeInTheDocument();
		expect(searchButtonIcon).toBeInTheDocument();

		expect(func).not.toHaveBeenCalled();

		await userEvent.click(searchButton!);

		expect(func).toHaveBeenCalled();
	});

	it('renders with clear icon only when value', async () => {
		const func = jest.fn();
		const rendered = render(<SearchInput value={''} onClearSearchClick={func} clearSearchIcon={'cog'} />);

		const clearButton = rendered.container.querySelector('.ss__search-input__button--clear-search-icon');
		const clearButtonIcon = rendered.container.querySelector('.ss__search-input__button--clear-search-icon .ss__icon--cog');

		expect(clearButton).not.toBeInTheDocument();
		expect(clearButtonIcon).not.toBeInTheDocument();

		const rendered2 = render(<SearchInput value={'val'} onClearSearchClick={func} clearSearchIcon={'cog'} />);

		const clearButton2 = rendered2.container.querySelector('.ss__search-input__button--clear-search-icon');
		const clearButtonIcon2 = rendered2.container.querySelector('.ss__search-input__button--clear-search-icon .ss__icon--cog');

		expect(clearButton2).toBeInTheDocument();
		expect(clearButtonIcon2).toBeInTheDocument();

		expect(func).not.toHaveBeenCalled();

		await userEvent.click(clearButton2!);

		expect(func).toHaveBeenCalled();

		//hmm this doesnt work in the test..
		// const input = rendered2.container.querySelector('input');
		// expect(input!.value).toBe('');
	});

	it('renders with close icon', async () => {
		const func = jest.fn();
		const rendered = render(<SearchInput value={''} onCloseSearchClick={func} closeSearchIcon={'cog'} />);
		const closeButton = rendered.container.querySelector('.ss__search-input__button--close-search-icon');
		const closeButtonIcon = rendered.container.querySelector('.ss__search-input__button--close-search-icon .ss__icon--cog');

		rendered.debug();

		expect(closeButton).toBeInTheDocument();
		expect(closeButtonIcon).toBeInTheDocument();

		expect(func).not.toHaveBeenCalled();

		await userEvent.click(closeButton!);

		expect(func).toHaveBeenCalled();
	});

	describe('search input lang works', () => {
		const selector = '.ss__search-input';

		it('immediately available lang options', async () => {
			// placeholderText
			const langOptions = ['searchButton', 'clearSearchButton', 'closeSearchButton'];

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
				langObjs.forEach(async (langObj) => {
					const lang = {
						[`${option}`]: langObj,
					};

					// @ts-ignore
					const rendered = render(<SearchInput value={'dress'} lang={lang} closeSearchIcon={'close'} clearSearchIcon={'close-thin'} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);
					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
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
			<ThemeProvider theme={theme}>
				<SearchInput value={''} />
			</ThemeProvider>
		);

		const searchInput: HTMLInputElement = rendered.container.querySelector('.ss__search-input__input')!;
		expect(searchInput).toBeInTheDocument();

		expect(searchInput?.placeholder).toBe(theme.components.searchInput.placeholderText);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<SearchInput value={''} theme={theme} />);
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
				<SearchInput value={''} theme={componentTheme} />
			</ThemeProvider>
		);
		const searchInput: HTMLInputElement | null = rendered.container.querySelector('.ss__search-input__input');
		expect(searchInput).toBeInTheDocument();

		expect(searchInput?.placeholder).toBe(componentTheme.components.searchInput.placeholderText);
	});
});
