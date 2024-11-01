import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import { PerPage } from './PerPage';
import userEvent from '@testing-library/user-event';

describe('PerPage Component', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta();

	const paginationStore = new SearchPaginationStore({
		config: searchConfig,
		services,
		data: {
			search: data.search,
			meta: data.meta,
		},
	});

	it('it renders with options', () => {
		const rendered = render(<PerPage pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__per-page__select');

		expect(element).toBeInTheDocument();
	});

	it('it renders with a label', () => {
		const label = 'my label';
		const rendered = render(<PerPage label={label} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__per-page__select');
		const labelElem = rendered.container.querySelector('.ss__select__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).toBeInTheDocument();
		expect(labelElem?.innerHTML).toContain(label);
	});

	it('it renders as a dropdown type', () => {
		const rendered = render(<PerPage type={'dropdown'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__per-page__select');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a list type', () => {
		const rendered = render(<PerPage type={'list'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__per-page__list.ss__list');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a Radio type', () => {
		const rendered = render(<PerPage type={'radio'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__per-page__radioList.ss__radio-list');
		expect(element).toBeInTheDocument();
	});

	it('it can do setPageSize things', async () => {
		let func = jest.fn();

		paginationStore.setPageSize = func;
		const rendered = render(<PerPage type={'radio'} pagination={paginationStore} />);
		const option = rendered.container.querySelectorAll('.ss__radio-list__option')[2];
		expect(option).toBeInTheDocument();
		await userEvent.click(option);
		expect(func).toHaveBeenCalled();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<PerPage pagination={paginationStore} className={className} />);

		const element = rendered.container.querySelector('.ss__per-page__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<PerPage pagination={paginationStore} disableStyles />);

		const element = rendered.container.querySelector('.ss__per-page__select');

		expect(element?.classList).toHaveLength(4);
	});

	describe('Perpage lang works', () => {
		const selector = '.ss__per-page';

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
						const rendered = render(<PerPage pagination={paginationStore} type={typeOption} lang={lang} />);
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
										label: 'Per Page',
										open: false,
										options: paginationStore.pageSizeOptions,
										selectedOptions: [],
									});
								} else {
									expect(valueMock).toHaveBeenCalledWith({
										options: paginationStore.pageSizeOptions,
										selectedOptions: [],
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
				perPage: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<PerPage pagination={paginationStore} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__per-page__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.perPage.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				perPage: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<PerPage pagination={paginationStore} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__per-page__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.perPage.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				perPage: {
					className: 'classy',
				},
			},
		};
		const propTheme = {
			components: {
				perPage: {
					className: 'notClassy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<PerPage pagination={paginationStore} theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__per-page__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.perPage.className);
		expect(element).not.toHaveClass(globalTheme.components.perPage.className);
	});
});
