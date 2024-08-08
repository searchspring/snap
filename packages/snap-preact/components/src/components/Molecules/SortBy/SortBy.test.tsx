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
			search: data,
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

		expect(element?.classList).toHaveLength(2);
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
