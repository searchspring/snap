import { h } from 'preact';
import '@testing-library/jest-dom';
import { EventManager } from '@searchspring/snap-event-manager';
import { setupEvents } from './setupEvents';

describe('setupEvents', () => {
	let eventManager: EventManager;
	const makeSelectionsSpy = jest.fn();
	const makeSearchSpy = jest.fn();
	const makeRecs1Spy = jest.fn();
	const makeRecs2Spy = jest.fn();
	const makeRecs3Spy = jest.fn();

	beforeAll(() => {
		eventManager = setupEvents();

		window.searchspring = {
			controller: {
				search: {
					search: makeSearchSpy,
					store: {
						results: [
							{
								type: 'product',
								variants: {
									makeSelections: makeSelectionsSpy,
								},
							},
							{
								type: 'product',
								variants: {
									makeSelections: makeSelectionsSpy,
								},
							},
							{
								type: 'product',
								variants: {
									makeSelections: makeSelectionsSpy,
								},
							},
							{
								type: 'banner',
								variants: {
									makeSelections: makeSelectionsSpy,
								},
							},
						],
					},
				},
				recommend_similar_0: {
					type: 'recommendation',
					config: {
						realtime: true,
					},
					search: makeRecs1Spy,
					store: {
						results: [
							{
								type: 'product',
								variants: {
									makeSelections: makeSelectionsSpy,
								},
							},
							{
								type: 'product',
								variants: {
									makeSelections: makeSelectionsSpy,
								},
							},
						],
					},
				},
				recommend_similar_1: {
					type: 'recommendation',
					config: {
						realtime: true,
					},
					search: makeRecs2Spy,
				},
				recommend_trending_0: {
					type: 'recommendation',
					config: {
						realtime: false,
					},
					search: makeRecs3Spy,
				},
			},
		};
	});

	beforeEach(() => {
		expect(makeSelectionsSpy).not.toHaveBeenCalled();
		expect(makeSearchSpy).not.toHaveBeenCalled();
		expect(makeRecs1Spy).not.toHaveBeenCalled();
		expect(makeRecs2Spy).not.toHaveBeenCalled();
		expect(makeRecs3Spy).not.toHaveBeenCalled();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('creates and returns an eventManager', () => {
		expect(eventManager).toBeDefined();
		expect(eventManager.events).toBeDefined();
		expect(eventManager.fire).toBeDefined();
		expect(eventManager.on).toBeDefined();

		expect(makeSelectionsSpy).not.toHaveBeenCalled();
	});

	describe('controller/selectVariantOptions', () => {
		it('can listen for controller/selectVariantOptions event', () => {
			//no data passed at all
			expect(() => {
				eventManager.fire('controller/selectVariantOptions');
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			//resets selections if no data is passed
			expect(makeSelectionsSpy).toHaveBeenCalledWith(undefined);
		});

		it('can pass options in the data', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);
		});

		it('can pass exact match controllerId', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: ['search'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(3);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);
		});

		it('can pass controllerId with no options', () => {
			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { controllerIds: ['search'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(3);
			//reset
			expect(makeSelectionsSpy).toHaveBeenCalledWith(undefined);
		});

		it('can pass multiple exact match controllerId', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: ['search', 'recommend_similar_0'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);
		});

		it('can pass regex match controllerId', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: [/^recommend_/] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(2);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);
		});

		it('can pass regex and exact match controllerIds in an array', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: [/^recommend_/, 'search'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);
		});
	});

	describe('controller/recommendation/update', () => {
		it('can listen for event and invoked without parameters', () => {
			//no data passed at all
			expect(() => {
				eventManager.fire('controller/recommendation/update');
			}).not.toThrow();

			expect(makeRecs1Spy).toHaveBeenCalledTimes(1);
			expect(makeRecs2Spy).toHaveBeenCalledTimes(1);
			expect(makeRecs3Spy).not.toHaveBeenCalled();
		});

		it('can pass exact match controllerId', () => {
			const controllerIds = 'recommend_similar_0';
			expect(() => {
				eventManager.fire('controller/recommendation/update', { controllerIds });
			}).not.toThrow();

			expect(makeRecs1Spy).toHaveBeenCalledTimes(1);
			expect(makeRecs2Spy).not.toHaveBeenCalled();
			expect(makeRecs3Spy).not.toHaveBeenCalled();
		});

		it('can pass partial regex match controllerId', () => {
			const controllerIds = [/^recommend_/];
			expect(() => {
				eventManager.fire('controller/recommendation/update', { controllerIds });
			}).not.toThrow();

			expect(makeRecs1Spy).toHaveBeenCalledTimes(1);
			expect(makeRecs2Spy).toHaveBeenCalledTimes(1);
			expect(makeRecs3Spy).not.toHaveBeenCalled();
		});

		it('only invokes for recommendation type and if exists', () => {
			const controllerIds = ['recommend_similar_0', 'search', 'dne'];
			expect(() => {
				eventManager.fire('controller/recommendation/update', { controllerIds });
			}).not.toThrow();

			expect(makeRecs1Spy).toHaveBeenCalledTimes(1);
			expect(makeRecs2Spy).not.toHaveBeenCalled();
			expect(makeRecs3Spy).not.toHaveBeenCalled();
		});

		it('does not invoke if config.realtime is false', () => {
			const controllerIds = ['recommend_trending_1', 'search', 'dne'];
			expect(() => {
				eventManager.fire('controller/recommendation/update', { controllerIds });
			}).not.toThrow();

			expect(makeRecs1Spy).not.toHaveBeenCalled();
			expect(makeRecs2Spy).not.toHaveBeenCalled();
			expect(makeRecs3Spy).not.toHaveBeenCalled();
		});
	});
});
