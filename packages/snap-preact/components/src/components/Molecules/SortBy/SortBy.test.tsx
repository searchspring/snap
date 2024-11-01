import { h } from 'preact';

import { render } from '@testing-library/preact';
import { SortBy } from './SortBy';
import { ThemeProvider } from '../../../providers';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchSortingStore } from '@searchspring/snap-store-mobx';
import userEvent from '@testing-library/user-event';

describe('SortBy Component', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};
	const data = new MockData().searchMeta();

	const sortingStore = new SearchSortingStore({
		services,
		data: {
			search: data.search,
			meta: data.meta,
		},
	});

	it('it doesnt render without options', () => {
		const rendered = render(<SortBy />);

		const element = rendered.container.querySelector('.ss__sortby__select');

		expect(element).not.toBeInTheDocument();
	});

	it('it renders with options', () => {
		const rendered = render(<SortBy sorting={sortingStore} />);

		const element = rendered.container.querySelector('.ss__sortby__select');

		expect(element).toBeInTheDocument();
	});

	it('it renders with a label', () => {
		const label = 'my label';
		const rendered = render(<SortBy label={label} sorting={sortingStore} />);

		const element = rendered.container.querySelector('.ss__sortby__select');
		const labelElem = rendered.container.querySelector('.ss__select__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).toBeInTheDocument();
	});

	it('it can hide the label', () => {
		const label = 'my label';
		const lang = {
			label: {
				value: 'lang label',
			},
		};
		const rendered = render(<SortBy lang={lang} hideLabel={true} label={label} sorting={sortingStore} />);

		const element = rendered.container.querySelector('.ss__sortby__select');
		const labelElem = rendered.container.querySelector('.ss__select__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).not.toBeInTheDocument();
	});

	it('it renders as a dropdown type', () => {
		const rendered = render(<SortBy type={'dropdown'} sorting={sortingStore} />);
		const element = rendered.container.querySelector('.ss__sortby__select');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a list type', () => {
		const rendered = render(<SortBy type={'list'} sorting={sortingStore} />);
		const element = rendered.container.querySelector('.ss__sortby__list.ss__list');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a Radio type', () => {
		const rendered = render(<SortBy type={'radio'} sorting={sortingStore} />);
		const element = rendered.container.querySelector('.ss__sortby__radioList.ss__radio-list');
		expect(element).toBeInTheDocument();
	});

	it('it can do onClick things', async () => {
		let onClick = jest.fn();

		sortingStore.options.forEach((option) => (option.url.go = onClick));

		const rendered = render(<SortBy type={'radio'} sorting={sortingStore} />);
		const option = rendered.container.querySelectorAll('.ss__radio-list__option')[3];
		expect(option).toBeInTheDocument();

		await userEvent.click(option);

		expect(onClick).toHaveBeenCalled();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<SortBy sorting={sortingStore} className={className} />);

		const element = rendered.container.querySelector('.ss__sortby__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<SortBy sorting={sortingStore} disableStyles />);

		const element = rendered.container.querySelector('.ss__sortby__select');

		expect(element?.classList).toHaveLength(4);
	});

	describe('Sortby lang works', () => {
		const selector = '.ss__sortby';

		it('immediately available lang options', async () => {
			const langOptions = ['label'];

			const typeOptions = ['dropdown', 'list', 'radio'];

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
				typeOptions.forEach((typeOption) => {
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
						const rendered = render(<SortBy sorting={sortingStore} type={typeOption} lang={lang} />);
						const element = rendered.container.querySelector(selector);
						expect(element).toBeInTheDocument();

						let langElems;
						if (typeOption == 'dropdown') {
							langElems = rendered.container.querySelectorAll(`[ss-lang=buttonLabel]`);
						} else {
							langElems = rendered.container.querySelectorAll(`[ss-lang=title]`);
						}
						expect(langElems.length).toBeGreaterThan(0);

						langElems.forEach((elem) => {
							if (typeof langObj.value == 'function') {
								if (typeOption == 'dropdown') {
									expect(valueMock).toHaveBeenCalledWith({
										label: 'Sort By',
										open: false,
										options: sortingStore.options,
										selectedOptions: [sortingStore.current],
									});
								} else {
									expect(valueMock).toHaveBeenCalledWith({
										options: sortingStore.options,
										selectedOptions: [sortingStore.current],
									});
								}

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
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				sortBy: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<SortBy sorting={sortingStore} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__sortby__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.sortBy.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				sortBy: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<SortBy sorting={sortingStore} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__sortby__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.sortBy.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				sortBy: {
					className: 'classy',
				},
			},
		};
		const propTheme = {
			components: {
				sortBy: {
					className: 'notClassy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<SortBy sorting={sortingStore} theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__sortby__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.sortBy.className);
		expect(element).not.toHaveClass(globalTheme.components.sortBy.className);
	});
});
