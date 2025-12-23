import deepmerge from 'deepmerge';
import { AbstractController } from '../Abstract/AbstractController';
import { ContextVariables, ControllerServices, ControllerTypes } from '../types';
import { ErrorType, ConversationalSearchStore } from '@searchspring/snap-store-mobx';

type ConversationalSearchControllerConfig = {
	id: string;
	settings?: any;
};
const defaultConfig: ConversationalSearchControllerConfig = {
	id: 'search',
	settings: {},
};

export class ConversationalSearchController extends AbstractController {
	public type = ControllerTypes.conversationalSearch;
	declare store: ConversationalSearchStore;
	declare config: ConversationalSearchControllerConfig;

	constructor(
		config: ConversationalSearchControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context?: ContextVariables
	) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker }, context);

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);

		this.store.setConfig(this.config);

		// attach config plugins and event middleware
		this.use(this.config);
	}

	get params(): any {
		const params = {
			context: {
				dataProtection: false,
				sessionId: this.store.sessionId || '',
				klevuApiKey: 'klevu-164270249063714699',
			},
			message: this.store.inputValue,
		};

		// context
		// :
		// {sessionId: "ce777867-da25-4178-8bbb-925f29fc5f78", klevuApiKey: "klevu-164270249063714699",…}
		// dataProtection
		// :
		// true
		// ipAddressV4
		// :
		// "184.144.54.225"
		// klevuApiKey
		// :
		// "klevu-164270249063714699"
		// klevu_uuid
		// :
		// "45752307-f703-4600-b2a5-4f8168112f9d"
		// sessionId
		// :
		// "ce777867-da25-4178-8bbb-925f29fc5f78"
		// message
		// :
		// "show filters"
		return params;
	}

	send = async (): Promise<void> => {
		const value = this.store.inputValue;
		console.log('Sending message:', value);
		const params = this.params;
		const response = await this.client.conversationalSearch(params);
		this.store.handleResponse(response);

		console.log('send response', response);
	};
	search = async (): Promise<void> => {
		try {
			if (!this.initialized) {
				await this.init();
			}
			// const params = this.params;
			// this.store.loading = true;
			// const response = this.client.search(params);
			// this.store.update(response as any);
		} catch (err: any) {
			if (err) {
				if (err.err && err.fetchDetails) {
					switch (err.fetchDetails.status) {
						case 429: {
							this.store.error = {
								code: 429,
								type: ErrorType.WARNING,
								message: 'Too many requests try again later',
							};
							break;
						}

						case 500: {
							this.store.error = {
								code: 500,
								type: ErrorType.ERROR,
								message: 'Invalid Search Request or Service Unavailable',
							};
							break;
						}

						default: {
							this.store.error = {
								type: ErrorType.ERROR,
								message: err.err.message,
							};
							break;
						}
					}

					this.log.error(this.store.error);
					this.handleError(err.err, err.fetchDetails);
				} else {
					this.store.error = {
						type: ErrorType.ERROR,
						message: `Something went wrong... - ${err}`,
					};
					this.log.error(err);
					this.handleError(err);
				}
			}
		} finally {
			this.store.loading = false;
		}
	};
}
