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
		expect(labelElem?.innerHTML).toContain(label);
	});

	it('it renders as a dropdown type', () => {
		const rendered = render(<PerPage type={'dropdown'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__select');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a list type', () => {
		const rendered = render(<PerPage type={'list'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__list.ss__list');
		expect(element).toBeInTheDocument();
	});

	it('it renders as a Radio type', () => {
		const rendered = render(<PerPage type={'radio'} pagination={paginationStore} />);

		const element = rendered.container.querySelector('.ss__perpage__radioList.ss__radio-list');
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
