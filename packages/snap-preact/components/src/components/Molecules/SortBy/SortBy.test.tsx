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

	const sortingStore = new SearchSortingStore(services, data.sorting!, data.search!, data.meta);

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

		expect(element?.classList).toHaveLength(3);
	});

	describe('Select lang works', () => {
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

						// @ts-ignore
						const rendered = render(<SortBy sorting={sortingStore} type={typeOption} lang={lang} />);
						const element = rendered.container.querySelector(selector);
						expect(element).toBeInTheDocument();
						let langElem;
						if (typeOption == 'dropdown') {
							langElem = rendered.container.querySelector(`[ss-lang=buttonLabel]`);
						} else {
							langElem = rendered.container.querySelector(`[ss-lang=title]`);
						}
						expect(langElem).toBeInTheDocument();
						if (typeof langObj.value == 'function') {
							expect(langElem?.innerHTML).toBe(value);

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

		// it('custom lang options', async () =>{
		// const lessValue = "less value";
		// const lessAltText = "less alt";
		// const lessAriaLabel = 'less label';
		// const lessAriaValueText = "less value text";
		// const lessTitle = "less title";

		// const lang = {
		// 	showLessText: {
		// 		value: lessValue,
		// 		attributes: {
		// 			"alt": lessAltText,
		// 			"aria-label": lessAriaLabel,
		// 			"aria-valuetext": lessAriaValueText,
		// 			"title": lessTitle
		// 		}
		// 	},
		// }

		// const rendered = render(<Grid options={options} lang={lang} columns={2} rows={2} />);

		// const element = rendered.container.querySelector(selector);
		// expect(element).toBeInTheDocument();

		// let overflowButton = rendered.container.querySelector('.ss__grid__show-more-wrapper');

		// await userEvent.click(overflowButton!);

		// const lessElem = rendered.container.querySelector(`[ss-lang=showLessText]`);

		// expect(lessElem).toBeInTheDocument();
		// expect(lessElem?.innerHTML).toBe(lessValue);
		// expect(lessElem).toHaveAttribute("alt", lessAltText);
		// expect(lessElem).toHaveAttribute("aria-label", lessAriaLabel);
		// expect(lessElem).toHaveAttribute("aria-valuetext", lessAriaValueText);
		// expect(lessElem).toHaveAttribute("title", lessTitle);
		// });
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
