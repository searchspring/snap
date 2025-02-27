import { h } from 'preact';

import { render, RenderResult } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { PaginationInfo } from './PaginationInfo';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { MockData } from '@searchspring/snap-shared';

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

describe('PaginationInfo Component', () => {
	it('renders', () => {
		const rendered = render(<PaginationInfo pagination={paginationStore} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationElement).toBeInTheDocument();
	});

	it('has text content', () => {
		const rendered = render(<PaginationInfo pagination={paginationStore} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationElement?.textContent).toBe(`${paginationStore.begin} - ${paginationStore.end} of ${paginationStore.totalResults} results`);
	});

	it('can change text content via infoText as string', () => {
		const rendered = render(<PaginationInfo infoText={'hello world'} pagination={paginationStore} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationElement?.textContent).toBe(`hello world`);
	});

	it('can change text content via infoText as function', () => {
		const rendered = render(
			<PaginationInfo
				infoText={({ pagination }) => {
					return `hello world ${pagination?.begin}`;
				}}
				pagination={paginationStore}
			/>
		);
		const paginationElement = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationElement?.textContent).toBe(`hello world ${paginationStore.begin}`);
	});
});

describe('PaginationInfo lang works', () => {
	const selector = '.ss__pagination-info';

	it('immediately available lang options', async () => {
		const langOptions = ['infoText'];

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

				// @ts-ignore
				const rendered = render(<PaginationInfo pagination={paginationStore} lang={lang} />);

				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();
				const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);
				expect(langElem).toBeInTheDocument();
				if (typeof langObj.value == 'function') {
					expect(langElem?.innerHTML).toBe(value);

					expect(valueMock).toHaveBeenCalledWith({
						pagination: paginationStore,
					});
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

describe('PaginationInfo theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				paginationInfo: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<PaginationInfo pagination={paginationStore} />
			</ThemeProvider>
		);
		const paginationInfo = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationInfo).toBeInTheDocument();
		expect(paginationInfo?.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				paginationInfo: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<PaginationInfo pagination={paginationStore} theme={propTheme} />);
		const paginationInfo = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationInfo).toBeInTheDocument();
		expect(paginationInfo?.classList.length).toBe(1);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				paginationInfo: {
					disableStyles: false,
				},
			},
		};
		const propTheme = {
			components: {
				paginationInfo: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<PaginationInfo pagination={paginationStore} theme={propTheme} />
			</ThemeProvider>
		);

		const paginationInfo = rendered.container.querySelector('.ss__pagination-info');
		expect(paginationInfo).toBeInTheDocument();
		expect(paginationInfo?.classList.length).toBe(1);
	});
});
