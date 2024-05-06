import { h } from 'preact';
import '@testing-library/jest-dom';
import { EventManager } from '@searchspring/snap-event-manager';
import { setupEvents } from './setupEvents';

describe('setupEvents', () => {
	let eventManager: EventManager;
	const makeSelectionsSpy = jest.fn();

	beforeAll(() => {
		eventManager = setupEvents();

		window.searchspring = {
			controller: {
				search: {
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
			},
		};
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
			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			//no data passed at all
			expect(() => {
				eventManager.fire('controller/selectVariantOptions');
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			//resets selections if no data is passed
			expect(makeSelectionsSpy).toHaveBeenCalledWith(undefined);

			jest.clearAllMocks();
		});

		it('can pass options in the data', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);

			jest.clearAllMocks();
		});

		it('can pass exact match controllerId', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: ['search'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(3);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);

			jest.clearAllMocks();
		});

		it('can pass controllerId with no options', () => {
			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { controllerIds: ['search'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(3);
			//reset
			expect(makeSelectionsSpy).toHaveBeenCalledWith(undefined);

			jest.clearAllMocks();
		});

		it('can pass multiple exact match controllerId', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: ['search', 'recommend_similar_0'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);

			jest.clearAllMocks();
		});

		it('can pass regex match controllerId', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: [/^recommend_/] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(2);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);

			jest.clearAllMocks();
		});

		it('can pass regex and exact match controllerIds in an array', () => {
			const options = {
				size: 'm',
				color: ['red', 'blue'],
			};

			expect(makeSelectionsSpy).not.toHaveBeenCalled();

			expect(() => {
				eventManager.fire('controller/selectVariantOptions', { options: options, controllerIds: [/^recommend_/, 'search'] });
			}).not.toThrow();

			expect(makeSelectionsSpy).toHaveBeenCalledTimes(5);
			expect(makeSelectionsSpy).toHaveBeenCalledWith(options);

			jest.clearAllMocks();
		});
	});
});
