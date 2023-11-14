import 'whatwg-fetch';
import { h, Fragment } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import { SearchStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';
import { SearchResultTracker } from './SearchResultTracker';

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
let controller: SearchController;

const mockClient = new MockClient(globals, {});

describe('Result Tracker Component', () => {
	beforeEach(async () => {
		searchConfig = { ...searchConfigDefault };
		searchConfig.id = uuidv4().split('-').join('');

		controller = new SearchController(searchConfig, {
			client: mockClient,
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
	});

	it('tracks onClick', async () => {
		const trackfn = jest.spyOn(controller.tracker.track, 'event');

		await controller.search();

		const rendered = render(
			<Fragment>
				{controller.store.results.map((result, idx) => (
					<SearchResultTracker controller={controller} result={result}>
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					</SearchResultTracker>
				))}
			</Fragment>
		);

		const resultElem = rendered.container.querySelector('.findMe');

		await userEvent.click(resultElem!);

		expect(trackfn).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				type: BeaconType.CLICK,
				category: BeaconCategory.INTERACTION,
				event: {
					href: controller.store.results[0].mappings.core?.url,
					intellisuggestData: controller.store.results[0].attributes.intellisuggestData,
					intellisuggestSignature: controller.store.results[0].attributes.intellisuggestSignature,
				},
			})
		);

		trackfn.mockClear();
	});
});
