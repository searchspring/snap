import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { v4 as uuidv4 } from 'uuid';
import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { RecommendationController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { QueryStringTranslator, UrlManager, reactLinker } from '@searchspring/snap-url-manager';
import userEvent from '@testing-library/user-event';
import { RecommendationEmail } from './RecommendationEmail';

const globals = { siteId: '8uyt2m' };

const recommendationConfigDefault: RecommendationControllerConfig = {
	id: 'email_0',
	tag: 'email',
};

let config: RecommendationStoreConfig;
const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = { urlManager };
let controller: RecommendationController;

const mockClient = new MockClient(globals, {});

describe('RecommendationEmail Template Component', () => {
	beforeEach(async () => {
		config = { ...recommendationConfigDefault };
		config.id = uuidv4().split('-').join('');

		controller = new RecommendationController(config, {
			client: mockClient,
			store: new RecommendationStore(config, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();
	});

	it('renders', () => {
		const rendered = render(<RecommendationEmail controller={controller} />);
		const element = rendered.container.querySelector('#ss-emailrec0');
		expect(element).toBeInTheDocument();
	});

	it('renders all results', () => {
		const rendered = render(<RecommendationEmail controller={controller} />);
		const elements = rendered.container.querySelectorAll('[id^="ss-emailrec"]');
		expect(elements.length).toBe(controller.store?.results?.length);
	});

	it('renders with a custom result component', () => {
		const rendered = render(<RecommendationEmail controller={controller} resultComponent={() => <div>Custom Result</div>} />);
		const element = rendered.container.querySelector('#ss-emailrec0');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Custom Result');
	});

	it('renders with custom result width', () => {
		const customWidth = '300px';
		const rendered = render(<RecommendationEmail controller={controller} resultWidth={customWidth} />);
		const element = rendered.container.querySelector('#ss-emailrec0');
		expect(element).toBeInTheDocument();
		expect(element).toHaveStyle(`width: ${customWidth}`);
	});

	it('renders with custom result props and email prop', () => {
		const key = 'testProp';
		const value = 'testValue';
		const customProps = { [key]: value };
		const rendered = render(
			<RecommendationEmail controller={controller} resultProps={customProps} resultComponent={(props) => <div {...props}>Custom Result</div>} />
		);
		const element = rendered.container.querySelector('#ss-emailrec0 div');
		expect(element).toBeInTheDocument();
		expect(element).toHaveAttribute(key, value);
		expect(element).toHaveAttribute('email', 'true');
	});
});
