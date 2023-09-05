import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import type { SearchResultStore } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

import { v4 as uuidv4 } from 'uuid';
import { SearchStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';
import { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { QueryStringTranslator, UrlManager, reactLinker } from '@searchspring/snap-url-manager';
import { NoResults } from '../NoResults';

const globals = { siteId: '8uyt2m' };

const searchConfigDefault: SearchControllerConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};

let searchConfig: SearchStoreConfig;
const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = { urlManager };

describe('NoResults  Component', () => {
	it('renders with controller', () => {
		const mockClient = new MockClient(globals, {});
		mockClient.mockData.updateConfig({ search: 'filteredRangeBucket' });
		searchConfig = { ...searchConfigDefault };
		searchConfig.id = uuidv4().split('-').join('');

		let controller = new SearchController(searchConfig, {
			client: mockClient,
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const rendered = render(<NoResults controller={controller} />);

		const element = rendered.container.querySelector('.ss__no-results');
		expect(element).toBeInTheDocument();
	});

	it('renders without controller', () => {
		const rendered = render(<NoResults />);

		const element = rendered.container.querySelector('.ss__no-results');
		expect(element).toBeInTheDocument();
	});

	it('renders with custom static slot', () => {
		const slot = <div className="findMe">custom</div>;
		const rendered = render(<NoResults staticSlot={slot} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const slotElem = rendered.container.querySelector('.findMe');
		expect(element).toBeInTheDocument();
		expect(slotElem).toBeInTheDocument();
	});

	it('renders with custom suggestionsList', () => {
		const suggestions = ['suggestion1', 'suggestion2', 'suggestion3', 'suggestion4'];

		const rendered = render(<NoResults suggestionsList={suggestions} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionElems = rendered.container.querySelectorAll('.ss__no-results__suggestion-list__option');
		expect(element).toBeInTheDocument();
		expect(suggestionElems).toHaveLength(suggestions.length);
		suggestionElems.forEach((elem, idx) => expect(elem.innerHTML).toBe(suggestions[idx]));
	});

	it('renders with custom contactsList', () => {
		const contacts = [
			{
				title: 'contact1',
				content: 'content1',
			},
			{
				title: 'contact2',
				content: 'content2',
			},
			{
				title: 'contact3',
				content: 'content3',
			},
			{
				title: 'contact4',
				content: 'content4',
			},
			{
				title: 'contact5',
				content: 'content5',
			},
		];

		const rendered = render(<NoResults contactsList={contacts} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const contactElems = rendered.container.querySelectorAll('.ss__no-results__contact__detail');
		expect(element).toBeInTheDocument();
		expect(contactElems).toHaveLength(contacts.length);
		contactElems.forEach((elem, idx) => {
			expect(elem).toContainHTML(
				`<div class="ss__no-results__contact__detail ss__contact__detail--${contacts[idx].title}"><h4 class="ss__no-results__contact__detail__title">${contacts[idx].title}</h4><p>${contacts[idx].content}</p></div>`
			);
		});
	});

	it('renders expected defaults', () => {
		const rendered = render(<NoResults />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionTitle = rendered.container.querySelector('.ss__no-results__title');
		const suggestionsList = rendered.container.querySelectorAll('.ss__no-results__suggestion-list__option');
		const contactsTitle = rendered.container.querySelector('.ss__no-results__contact__title');
		const contactList = rendered.container.querySelectorAll('.ss__no-results__contact__detail');

		expect(element).toBeInTheDocument();
		expect(suggestionTitle?.innerHTML).toBe('Suggestions');
		expect(suggestionsList).toHaveLength(3);
		expect(contactsTitle?.innerHTML).toBe(`Still can't find what you're looking for? &lt;a href="/contact-us"&gt;Contact us&lt;/a&gt;.`);
		expect(contactList).toHaveLength(4);
	});

	it('renders default dym', async () => {
		const mockClient2 = new MockClient(globals, {});
		mockClient2.mockData.updateConfig({ search: 'dym' });

		const dymController = new SearchController(searchConfig, {
			client: mockClient2,
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await dymController.search();

		const rendered = render(<NoResults controller={dymController} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const dym = rendered.container.querySelector('.ss__no-results__did-you-mean');

		expect(element).toBeInTheDocument();
		expect(dym).toBeInTheDocument();
		expect(dym?.innerHTML).toBe('Did you mean <a href="/?q=dress">dress</a>?');
	});

	it('renders custom dym', async () => {
		const mockClient2 = new MockClient(globals, {});
		mockClient2.mockData.updateConfig({ search: 'dym' });

		const dymController = new SearchController(searchConfig, {
			client: mockClient2,
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await dymController.search();

		const dymText = 'wrong term, try something else';

		const rendered = render(<NoResults controller={dymController} dymText={dymText} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const dym = rendered.container.querySelector('.ss__no-results__did-you-mean');

		expect(element).toBeInTheDocument();
		expect(dym).toBeInTheDocument();
		expect(dym?.innerHTML).toBe(dymText);
	});

	it('can change the suggestion title', () => {
		const title = 'title';
		const rendered = render(<NoResults suggestionsTitleText={title} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionTitle = rendered.container.querySelector('.ss__no-results__title');

		expect(element).toBeInTheDocument();
		expect(suggestionTitle?.innerHTML).toBe(title);
	});

	it('can change the contact title', () => {
		const title = 'title';
		const rendered = render(<NoResults contactsTitleText={title} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const contactsTitle = rendered.container.querySelector('.ss__no-results__contact__title');

		expect(element).toBeInTheDocument();
		expect(contactsTitle?.innerHTML).toBe(title);
	});

	it('can hide the contact section', () => {
		const rendered = render(<NoResults hideContact={true} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const contactsElem = rendered.container.querySelector('.ss__no-results__contact');

		expect(element).toBeInTheDocument();
		expect(contactsElem).not.toBeInTheDocument();
	});
	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<NoResults className={className} />);

		const element = rendered.container.querySelector('.ss__no-results');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<NoResults disableStyles />);

		const element = rendered.container.querySelector('.ss__no-results');

		expect(element?.classList).toHaveLength(1);
	});
});

describe('NoResult theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				noResults: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<NoResults />
			</ThemeProvider>
		);
		const elem = rendered.container.querySelector('.ss__no-results');
		expect(elem).toHaveClass(globalTheme.components.noResults.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				noResults: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<NoResults theme={propTheme} />);
		const elem = rendered.container.querySelector('.ss__no-results');
		expect(elem).toHaveClass(propTheme.components.noResults.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				noResults: {
					className: 'notclassy',
				},
			},
		};
		const propTheme = {
			components: {
				noResults: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<NoResults theme={propTheme} />
			</ThemeProvider>
		);

		const elem = rendered.container.querySelector('.ss__no-results');
		expect(elem).toHaveClass(propTheme.components.noResults.className);
		expect(elem).not.toHaveClass(globalTheme.components.noResults.className);
	});
});
