import { h } from 'preact';

import { ThemeProvider } from '../../../providers';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Filter } from './Filter';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchFilterStore } from '@searchspring/snap-store-mobx';

describe('Filter Component', () => {
	const args = {
		facetLabel: 'facet',
		valueLabel: 'value',
	};

	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};
	const mockData = new MockData().searchMeta('filtered');

	it('renders', () => {
		const rendered = render(<Filter {...args} />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toBeInTheDocument();

		const facetTextElement = rendered.getByText(args.facetLabel);
		const valueTextElement = rendered.getByText(args.valueLabel);
		const iconElement = rendered.container.querySelector('.ss__icon');

		expect(filterElement?.classList).toHaveLength(2);

		expect(facetTextElement).toBeInTheDocument();
		expect(facetTextElement).toHaveClass('ss__filter__label');

		expect(valueTextElement).toBeInTheDocument();
		expect(valueTextElement).toHaveClass('ss__filter__value');

		expect(iconElement).toBeInTheDocument();
	});

	it('renders with Filter prop data', () => {
		const filters = new SearchFilterStore({
			services,
			data: {
				search: mockData,
				meta: mockData.meta,
			},
		});
		const filter = filters[0];
		const rendered = render(<Filter filter={filter} />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toBeInTheDocument();

		const facetTextElement = rendered.getByText(filter.facet.label!);
		const valueTextElement = rendered.getByText(filter.value.label!);

		expect(facetTextElement).toBeInTheDocument();
		expect(valueTextElement).toBeInTheDocument();
	});

	it('renders with specified icon', () => {
		const icon = 'cog';
		const rendered = render(<Filter {...args} icon={icon} />);
		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toBeInTheDocument();

		const iconElement = rendered.container.querySelector('.ss__icon');

		expect(iconElement).toBeInTheDocument();
		expect(iconElement).toHaveClass(`ss__icon--${icon}`);
	});

	it('has a url value when passed one', () => {
		const url = 'www.searchspring.com';
		const urlManager = new UrlManager(new UrlTranslator({ urlRoot: url }), reactLinker);

		const rendered = render(<Filter {...args} url={urlManager} />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toHaveAttribute('href', url);
	});

	it('does not show facetLabel when told not to', () => {
		const rendered = render(<Filter {...args} hideFacetLabel />);

		const facetTextElement = rendered.container.querySelector('.ss__filter__label');

		expect(facetTextElement).not.toBeInTheDocument();
	});

	it('can use a custom separator', () => {
		const separator = 'gottakeepemseperated';
		const rendered = render(<Filter {...args} separator={separator} />);

		const separatorTextElement = rendered.container.querySelector('.ss__filter__label__separator');
		const separatorText = rendered.getByText(separator);

		expect(separatorTextElement).toBeInTheDocument();
		expect(separatorText).toBeInTheDocument();
	});

	it('can have no separator', () => {
		const separator = '';
		const rendered = render(<Filter {...args} separator={separator} />);

		const separatorTextElement = rendered.container.querySelector('.ss__filter__label__separator');

		expect(separatorTextElement).not.toBeInTheDocument();
	});

	it('fires onClick prop when clicked', async () => {
		const clickFn = jest.fn();

		const rendered = render(<Filter {...args} onClick={clickFn} />);

		const filterElement = rendered.container.querySelector('.ss__filter')!;

		await userEvent.click(filterElement);
		expect(clickFn).toHaveBeenCalled();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Filter {...args} className={className} />);

		const filterElement = rendered.container.querySelector('.ss__filter');
		expect(filterElement).toBeInTheDocument();
		expect(filterElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<Filter {...args} disableStyles />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement?.classList).toHaveLength(1);
	});

	describe('Filter lang works', () => {
		const selector = '.ss__filter';

		it('immediately available lang options', async () => {
			const langOptions = ['filter'];

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
					const rendered = render(<Filter {...args} lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();
					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
						expect(langElem?.innerHTML).toBe(value);

						expect(valueMock).toHaveBeenCalledWith({
							label: args.facetLabel,
							value: args.valueLabel,
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
});

describe('Filter theming works', () => {
	const args = {
		facetLabel: 'facet',
		valueLabel: 'value',
	};

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				filter: {
					separator: 'seperator',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Filter {...args} />
			</ThemeProvider>
		);
		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(globalTheme.components.filter.separator);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				filter: {
					separator: 'seperator',
				},
			},
		};
		const rendered = render(<Filter {...args} theme={propTheme} />);
		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				filter: {
					separator: 'seperator',
				},
			},
		};
		const propTheme = {
			components: {
				filter: {
					separator: '---',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Filter {...args} theme={propTheme} />
			</ThemeProvider>
		);

		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
	});
});
