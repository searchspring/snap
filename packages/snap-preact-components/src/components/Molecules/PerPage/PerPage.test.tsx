import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchPaginationStore, SearchSortingStore } from '@searchspring/snap-store-mobx';
import { PerPage } from './PerPage';

describe('SortBy Component', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta();

	const paginationStore = new SearchPaginationStore(searchConfig, services, data.pagination, data.meta);

	it('it renders with options', () => {
		const rendered = render(<PerPage pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__select');

		expect(element).toBeInTheDocument();
	});

	it('it renders with a label', () => {
		const label = 'my label';
		const rendered = render(<PerPage label={label} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__select');
		const labelElem = rendered.container.querySelector('.ss__select__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).toBeInTheDocument();
	});

	it('it renders with as a dropdown type', () => {
		const rendered = render(<PerPage type={'Dropdown'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__select');
		expect(element).toBeInTheDocument();
	});

	it('it renders with as a list type', () => {
		const rendered = render(<PerPage type={'List'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__list.ss__radio-select');
		expect(element).toBeInTheDocument();
	});

	it('it renders with as a Radio type', () => {
		const rendered = render(<PerPage type={'Radio'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__radioList.ss__radio-select');
		expect(element).toBeInTheDocument();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<PerPage pagination={paginationStore} className={className} />);

		const element = rendered.container.querySelector('.ss__perpage__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<PerPage pagination={paginationStore} disableStyles />);

		const element = rendered.container.querySelector('.ss__perpage__select');

		expect(element?.classList).toHaveLength(2);
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
		const element = rendered.container.querySelector('.ss__perpage__select');
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
		const element = rendered.container.querySelector('.ss__perpage__select');
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

		const element = rendered.container.querySelector('.ss__perpage__select');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.perPage.className);
		expect(element).not.toHaveClass(globalTheme.components.perPage.className);
	});
});
