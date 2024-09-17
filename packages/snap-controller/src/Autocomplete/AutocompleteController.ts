import deepmerge from 'deepmerge';

import { StorageStore, ErrorType } from '@searchspring/snap-store-mobx';
import { AbstractController } from '../Abstract/AbstractController';
import { getSearchParams } from '../utils/getParams';
import { ControllerTypes } from '../types';

import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import type { AutocompleteControllerConfig, BeforeSearchObj, AfterSearchObj, AfterStoreObj, ControllerServices, ContextVariables } from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import type { AutocompleteRequestModel } from '@searchspring/snapi-types';

const INPUT_ATTRIBUTE = 'ss-autocomplete-input';
export const INPUT_DELAY = 200;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const PARAM_ORIGINAL_QUERY = 'oq';
const PARAM_FALLBACK_QUERY = 'fallbackQuery';

const defaultConfig: AutocompleteControllerConfig = {
	id: 'autocomplete',
	selector: '',
	action: '',
	globals: {},
	settings: {
		integratedSpellCorrection: false,
		initializeFromUrl: true,
		syncInputs: true,
		serializeForm: false,
		facets: {
			trim: true,
			pinFiltered: true,
		},
		redirects: {
			merchandising: true,
			singleResult: false,
		},
	},
};

type AutocompleteTrackMethods = {
	product: {
		click: (e: MouseEvent, result: any) => void;
	};
};

export class AutocompleteController extends AbstractController {
	public type = ControllerTypes.autocomplete;
	declare store: AutocompleteStore;
	declare config: AutocompleteControllerConfig;
	public storage: StorageStore;

	constructor(
		config: AutocompleteControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context?: ContextVariables
	) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker }, context);

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);
		this.store.setConfig(this.config);

		// get current search from url before detaching
		if (this.config.settings!.initializeFromUrl) {
			this.store.state.input = this.urlManager.state.query;

			// reset to force search on focus
			// TODO: make a config setting for this
			this.urlManager.reset().go();
		}

		// persist trending terms in local storage
		this.storage = new StorageStore({
			type: 'session',
			key: `ss-controller-${this.config.id}`,
		});

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (ac: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			ac.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (ac: AfterSearchObj, next: Next): Promise<void | boolean> => {
			await next();

			// cancel search if no input or query doesn't match current urlState
			if (ac.response.search.autocomplete.query != ac.controller.urlManager.state.query) {
				ac.controller.store.loading = false;
				return false;
			}
		});

		// add 'afterStore' middleware
		this.eventManager.on('afterStore', async (ac: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();

			ac.controller.store.loading = false;
		});

		this.eventManager.on('beforeSubmit', async (ac: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();

			const redirectURL = (ac.controller as AutocompleteController).store.merchandising?.redirect;
			if (redirectURL && this.config?.settings?.redirects?.merchandising) {
				window.location.href = redirectURL;
				return false;
			}

			if (this.config?.settings?.redirects?.singleResult) {
				const { results } = (ac.controller as AutocompleteController).store;
				const singleResultUrl = results.length === 1 && results[0].type === 'product' && results[0].mappings.core?.url;
				if (singleResultUrl) {
					window.location.href = singleResultUrl;
					return false;
				}
			}
		});

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: AutocompleteTrackMethods = {
		// TODO: add in future when autocomplete supports result click tracking
		product: {
			click: (): void => {
				this.log.warn('product.click tracking is not currently supported in this controller type');
			},
		},
	};

	get params(): AutocompleteRequestModel {
		const urlState = this.urlManager.state;
		const params: AutocompleteRequestModel = deepmerge({ ...getSearchParams(urlState) }, this.config.globals!);

		const userId = this.tracker.getUserId();
		const sessionId = this.tracker.getContext().sessionId;
		const pageLoadId = this.tracker.getContext().pageLoadId;
		params.tracking = params.tracking || {};

		params.tracking.domain = window.location.href;

		if (userId) {
			params.tracking.userId = userId;
		}
		if (sessionId) {
			params.tracking.sessionId = sessionId;
		}
		if (pageLoadId) {
			params.tracking!.pageLoadId = pageLoadId;
		}

		if (!this.config.globals?.personalization?.disabled) {
			const cartItems = this.tracker.cookies.cart.get();
			if (cartItems.length) {
				params.personalization = params.personalization || {};
				params.personalization.cart = cartItems.join(',');
			}

			const lastViewedItems = this.tracker.cookies.viewed.get();
			if (lastViewedItems.length) {
				params.personalization = params.personalization || {};
				params.personalization.lastViewed = lastViewedItems.join(',');
			}

			const shopperId = this.tracker.getShopperId();
			if (shopperId) {
				params.personalization = params.personalization || {};
				params.personalization.shopper = shopperId;
			}
		}

		return params;
	}

	async setFocused(inputElement?: HTMLInputElement): Promise<void> {
		if (this.store.state.focusedInput !== inputElement) {
			this.store.state.focusedInput = inputElement as HTMLInputElement;
			// fire focusChange event
			try {
				try {
					await this.eventManager.fire('focusChange', {
						controller: this,
					});
				} catch (err: any) {
					if (err?.message == 'cancelled') {
						this.log.warn(`'focusChange' middleware cancelled`);
					} else {
						this.log.error(`error in 'focusChange' middleware`);
						throw err;
					}
				}
			} catch (err) {
				if (err) {
					console.error(err);
				}
			}
		}

		inputElement?.dispatchEvent(new Event('input'));
	}

	reset(): void {
		// reset input values and state
		const inputs = document.querySelectorAll(this.config.selector);
		inputs.forEach((input) => {
			(input as HTMLInputElement).value = '';
		});
		this.store.reset();
	}

	handlers = {
		input: {
			enterKey: async (e: KeyboardEvent): Promise<boolean | undefined> => {
				if (e.keyCode == KEY_ENTER) {
					const input = e.target as HTMLInputElement;
					let actionUrl = this.store.services.urlManager;

					e.preventDefault();

					// when spellCorrection is enabled
					if (this.config.globals?.search?.query?.spellCorrection) {
						// wait until loading is complete before submission
						// TODO make this better
						await timeout(INPUT_DELAY + 1);
						while (this.store.loading) {
							await timeout(INPUT_DELAY);
						}

						if (this.config.settings!.integratedSpellCorrection) {
							//set fallbackQuery to the correctedQuery
							if (this.store.search.correctedQuery) {
								actionUrl = actionUrl?.set(PARAM_FALLBACK_QUERY, this.store.search.correctedQuery.string);
							}
						} else if (this.store.search.originalQuery) {
							// use corrected query and originalQuery
							input.value = this.store.search.query?.string!;
							actionUrl = actionUrl?.set(PARAM_ORIGINAL_QUERY, this.store.search.originalQuery.string);
						}
					}

					actionUrl = actionUrl?.set('query', input.value);

					// TODO expected spell correct behavior queryAssumption

					try {
						await this.eventManager.fire('beforeSubmit', {
							controller: this,
							input,
						});
					} catch (err: any) {
						if (err?.message == 'cancelled') {
							this.log.warn(`'beforeSubmit' middleware cancelled`);
							return;
						} else {
							this.log.error(`error in 'beforeSubmit' middleware`);
							console.error(err);
						}
					}

					window.location.href = actionUrl?.href || '';
				}
			},
			escKey: (e: KeyboardEvent): void => {
				if (e.keyCode == KEY_ESCAPE) {
					(e.target as HTMLInputElement).blur();
					this.setFocused();
				}
			},
			focus: (e: FocusEvent): void => {
				e.stopPropagation();

				// timeout to ensure focus happens AFTER click
				setTimeout(() => {
					this.setFocused(e.target as HTMLInputElement);
				});
			},
			formSubmit: async (e: React.FormEvent<HTMLInputElement>): Promise<void> => {
				const form = e.target as HTMLFormElement;
				const input: HTMLInputElement | null = form.querySelector(`input[${INPUT_ATTRIBUTE}]`);

				e.preventDefault();

				// when spellCorrection is enabled
				if (this.config.globals?.search?.query?.spellCorrection) {
					// wait until loading is complete before submission
					// TODO make this better
					await timeout(INPUT_DELAY + 1);
					while (this.store.loading) {
						await timeout(INPUT_DELAY);
					}

					if (this.config.settings!.integratedSpellCorrection) {
						//set fallbackQuery to the correctedQuery
						if (this.store.search.correctedQuery) {
							addHiddenFormInput(form, PARAM_FALLBACK_QUERY, this.store.search.correctedQuery.string);
						}
					} else if (this.store.search.originalQuery) {
						// use corrected query and originalQuery
						if (input) {
							input.value = this.store.search.query?.string!;
						}
						addHiddenFormInput(form, PARAM_ORIGINAL_QUERY, this.store.search.originalQuery.string);
					}
				}

				// TODO expected spell correct behavior queryAssumption

				try {
					await this.eventManager.fire('beforeSubmit', {
						controller: this,
						input,
					});
				} catch (err: any) {
					if (err?.message == 'cancelled') {
						this.log.warn(`'beforeSubmit' middleware cancelled`);
						return;
					} else {
						this.log.error(`error in 'beforeSubmit' middleware`);
						console.error(err);
					}
				}

				form.submit();
			},
			formElementChange: (e: React.ChangeEvent<HTMLInputElement>): void => {
				const input = e.target as HTMLInputElement;
				const form = input?.form;
				const searchInput = form?.querySelector(`input[${INPUT_ATTRIBUTE}]`);

				if (form && searchInput && this.config.settings?.serializeForm) {
					// get other form parameters (except the input)
					const formParameters = getFormParameters(form, function (elem: HTMLInputElement) {
						return elem != searchInput;
					});

					// set parameters as globals
					this.store.setService('urlManager', this.store.services.urlManager.reset().withGlobals(formParameters));
					this.store.reset();

					// rebuild trending terms with new UrlManager settings
					if (this.config.settings?.trending?.limit && this.config.settings?.trending?.limit > 0) {
						this.searchTrending();
					}
				}
			},
			input: (e: Event) => {
				// return focus on input if it was lost
				if (e.isTrusted && this.store.state.focusedInput !== (e.target as HTMLInputElement)) {
					this.setFocused(e.target as HTMLInputElement);
				}

				const value = (e.target as HTMLInputElement).value;

				// prevent search when value is unchanged or empty
				if (((!this.store.state.input && !value) || this.store.state.input == value) && this.store.loaded) {
					return;
				}

				this.store.state.input = value;

				if (this.config?.settings?.syncInputs) {
					const inputs = document.querySelectorAll(this.config.selector);
					inputs.forEach((input) => {
						(input as HTMLInputElement).value = value;
					});
				}

				// TODO cancel any current requests?

				clearTimeout(this.handlers.input.timeoutDelay);

				const trendingResultsEnabled = this.store.trending?.length && this.config.settings?.trending?.showResults;
				const historyResultsEnabled = this.store.history?.length && this.config.settings?.history?.showResults;

				this.handlers.input.timeoutDelay = setTimeout(() => {
					if (!value) {
						// there is no input value - reset state of store
						this.store.reset();

						// show results for trending or history (if configured) - trending has priority
						if (trendingResultsEnabled) {
							this.store.trending[0].preview();
						} else if (historyResultsEnabled) {
							this.store.history[0].preview();
						} else {
							// no input - need to reset URL
							this.urlManager.reset().go();
						}
					} else {
						// new query in the input - trigger a new search via UrlManager
						this.store.state.locks.terms.unlock();
						this.store.state.locks.facets.unlock();
						this.urlManager.set({ query: this.store.state.input }).go();
					}
				}, INPUT_DELAY);
			},
			timeoutDelay: undefined as undefined | ReturnType<typeof setTimeout>,
		},
		document: {
			click: (e: MouseEvent): void => {
				const inputs = document.querySelectorAll(this.config.selector);
				if (Array.from(inputs).includes(e.target as Element)) {
					e.stopPropagation();
				} else {
					this.setFocused();
				}
			},
		},
	};

	unbind(): void {
		const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input[${INPUT_ATTRIBUTE}]`);
		inputs?.forEach((input) => {
			input.removeEventListener('input', this.handlers.input.input);
			input.removeEventListener('keydown', this.handlers.input.enterKey);
			input.removeEventListener('keydown', this.handlers.input.escKey);
			input.removeEventListener('focus', this.handlers.input.focus);

			if (input.form) {
				input.form.removeEventListener('submit', this.handlers.input.formSubmit as unknown as EventListener);
				unbindFormParameters(input.form, this.handlers.input.formElementChange);
			}
		});
		document.removeEventListener('click', this.handlers.document.click);
	}

	async bind(): Promise<void> {
		if (!this.initialized) {
			await this.init();
		}

		this.unbind();

		const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(this.config.selector);
		inputs.forEach((input) => {
			input.setAttribute('spellcheck', 'false');
			input.setAttribute('autocomplete', 'off');
			input.setAttribute('autocorrect', 'off');
			input.setAttribute('autocapitalize', 'none');

			input.setAttribute(INPUT_ATTRIBUTE, '');

			input.addEventListener('input', this.handlers.input.input);

			if (this.config?.settings?.initializeFromUrl && !input.value && this.store.state.input) {
				input.value = this.store.state.input;
			}

			input.addEventListener('focus', this.handlers.input.focus);
			input.addEventListener('keydown', this.handlers.input.escKey);

			const form = input.form;
			let formActionUrl: string | undefined;

			if (this.config.action) {
				input.addEventListener('keydown', this.handlers.input.enterKey);
				formActionUrl = this.config.action;
			} else if (form) {
				form.addEventListener('submit', this.handlers.input.formSubmit as unknown as EventListener);
				formActionUrl = form.action || '';

				// serializeForm will include additional form element in our urlManager as globals
				if (this.config.settings?.serializeForm) {
					bindFormParameters(form, this.handlers.input.formElementChange, function (elem: HTMLInputElement) {
						return elem != input;
					});

					const formParameters = getFormParameters(form, function (elem: HTMLInputElement) {
						return elem != input;
					});

					// set parameters as globals
					this.store.setService('urlManager', this.urlManager.reset().withGlobals(formParameters));
				}
			}

			// set the root URL on urlManager
			if (formActionUrl) {
				this.store.setService(
					'urlManager',
					this.store.services.urlManager.withConfig((translatorConfig: any) => {
						return {
							...translatorConfig,
							urlRoot: formActionUrl,
						};
					})
				);
			}

			// if the input is currently focused, trigger setFocues which will eventually trigger input - but not if loading
			if (document.activeElement === input && !this.store.loading) {
				this.setFocused(input);
			}
		});

		// get trending terms - this is at the bottom because urlManager changes need to be in place before creating the store
		if (this.config.settings?.trending?.limit && this.config.settings?.trending?.limit > 0 && !this.store.trending?.length) {
			this.searchTrending();
		}

		document.addEventListener('click', this.handlers.document.click);
	}

	searchTrending = async (): Promise<void> => {
		let trending;
		const storedTerms = this.storage.get('terms');
		if (storedTerms) {
			// terms exist in storage, update store
			trending = JSON.parse(storedTerms);
		} else {
			// query for trending terms, save to storage, update store
			const trendingParams = {
				limit: this.config.settings?.trending?.limit || 5,
			};

			const trendingProfile = this.profiler.create({ type: 'event', name: 'trending', context: trendingParams }).start();

			trending = await this.client.trending(trendingParams);

			trendingProfile.stop();
			this.log.profile(trendingProfile);
			if (trending?.trending.queries?.length) {
				this.storage.set('terms', JSON.stringify(trending));
			}
		}

		this.store.updateTrendingTerms(trending);
	};

	search = async (): Promise<void> => {
		// if urlManager has no query, there will be no need to get params and no query
		if (!this.urlManager.state.query) {
			return;
		}

		const params = this.params;

		// if params have no query do not search
		if (!params?.search?.query?.string) {
			return;
		}

		try {
			try {
				await this.eventManager.fire('beforeSearch', {
					controller: this,
					request: params,
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'beforeSearch' middleware cancelled`);
					return;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			const { meta, search } = await this.client.autocomplete(params);

			searchProfile.stop();
			this.log.profile(searchProfile);

			const afterSearchProfile = this.profiler.create({ type: 'event', name: 'afterSearch', context: params }).start();

			try {
				await this.eventManager.fire('afterSearch', {
					controller: this,
					request: params,
					response: {
						meta,
						search,
					},
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterSearch' middleware cancelled`);
					afterSearchProfile.stop();
					return;
				} else {
					this.log.error(`error in 'afterSearch' middleware`);
					throw err;
				}
			}

			afterSearchProfile.stop();
			this.log.profile(afterSearchProfile);

			// update the store
			this.store.update({ meta, search });

			const afterStoreProfile = this.profiler.create({ type: 'event', name: 'afterStore', context: params }).start();

			try {
				await this.eventManager.fire('afterStore', {
					controller: this,
					request: params,
					response: {
						meta,
						search,
					},
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterStore' middleware cancelled`);
					afterStoreProfile.stop();
					return;
				} else {
					this.log.error(`error in 'afterStore' middleware`);
					throw err;
				}
			}

			afterStoreProfile.stop();
			this.log.profile(afterStoreProfile);
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
				this.store.loading = false;
			}
		}
	};
}

function addHiddenFormInput(form: HTMLFormElement, name: string, value: string) {
	const inputElem = document.createElement('input');
	inputElem.type = 'hidden';
	inputElem.name = name;
	inputElem.value = value;

	// remove existing form element if it exists (prevent duplicates)
	form.querySelector(`[type="hidden"][name="${name}"]`)?.remove();

	// append form element
	form.append(inputElem);
}

async function timeout(time: number): Promise<void> {
	return new Promise((resolve) => {
		window.setTimeout(resolve, time);
	});
}

// for grabbing other parameters from the form and using them in UrlManager

const INPUT_TYPE_BLOCKLIST = ['file', 'reset', 'submit', 'button', 'image', 'password'];

function getFormParameters(form: HTMLFormElement, filterFn: any): { [formName: string]: string | undefined } {
	const parameters: { [formName: string]: string | undefined } = {};

	if (typeof form == 'object' && form.nodeName == 'FORM') {
		for (let i = form.elements.length - 1; i >= 0; i--) {
			const elem = form.elements[i] as HTMLInputElement;

			if (typeof filterFn == 'function' && !filterFn(elem)) {
				continue;
			}

			if (elem.name && !INPUT_TYPE_BLOCKLIST.includes(elem.type)) {
				if ((elem.type != 'checkbox' && elem.type != 'radio') || elem.checked) {
					parameters[elem.name] = elem.value;
				}
			}
		}
	}

	return parameters;
}

// this picks up changes to the form
function bindFormParameters(form: HTMLFormElement, fn: any, filterFn: any): void {
	if (typeof form == 'object' && form.nodeName == 'FORM') {
		for (let i = form.elements.length - 1; i >= 0; i--) {
			const elem = form.elements[i] as HTMLInputElement;

			if (typeof filterFn == 'function' && !filterFn(elem)) {
				continue;
			}

			if (elem.name && !INPUT_TYPE_BLOCKLIST.includes(elem.type)) {
				elem.addEventListener('change', fn);
			}
		}
	}
}

function unbindFormParameters(form: HTMLFormElement, fn: any): void {
	if (typeof form == 'object' && form.nodeName == 'FORM') {
		for (let i = form.elements.length - 1; i >= 0; i--) {
			const elem = form.elements[i] as HTMLInputElement;

			if (elem.name && !INPUT_TYPE_BLOCKLIST.includes(elem.type)) {
				elem.removeEventListener('change', fn);
			}
		}
	}
}
