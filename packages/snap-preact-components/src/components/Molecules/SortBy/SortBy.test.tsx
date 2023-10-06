import { h } from 'preact';

import { render } from '@testing-library/preact';
import { SortBy } from './SortBy';
import { ThemeProvider } from '../../../providers';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchSortingStore } from '@searchspring/snap-store-mobx';

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

	it('it renders with as a dropdown type', () => {
		const rendered = render(<SortBy type={'Dropdown'} sorting={sortingStore} />);

		const element = rendered.container.querySelector('.ss__sortby__select');
		expect(element).toBeInTheDocument();
	});

	it('it renders with as a list type', () => {
		const rendered = render(<SortBy type={'List'} sorting={sortingStore} />);

		const element = rendered.container.querySelector('.ss__sortby__list.ss__radio-select');
		expect(element).toBeInTheDocument();
	});

	it('it renders with as a Radio type', () => {
		const rendered = render(<SortBy type={'Radio'} sorting={sortingStore} />);

		const element = rendered.container.querySelector('.ss__sortby__radioList.ss__radio-select');
		expect(element).toBeInTheDocument();
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
