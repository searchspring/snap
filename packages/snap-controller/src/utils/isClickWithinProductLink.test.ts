import { isClickWithinProductLink, CLICK_THROUGH_CLOSEST_MAX_LEVELS } from './isClickWithinProductLink';

describe('isClickWithinProductLink', () => {
	const createMockProduct = (url: string): any => ({
		mappings: {
			core: {
				url,
			},
		},
	});

	it('should return true if the click is within an element with matching href', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		// Mock the target element and its parent chain
		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/product/123';
		Object.defineProperty(e, 'target', { value: targetElement });

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should return true if the click is within a parent element with matching href', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		// Create a nested structure
		const parentElement = document.createElement('a');
		parentElement.href = 'https://www.example.com/product/123';
		const childElement = document.createElement('span');
		parentElement.appendChild(childElement);

		Object.defineProperty(e, 'target', { value: childElement });

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should return false if no matching href is found within max levels', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const parentElement = document.createElement('a');
		parentElement.href = 'https://www.example.com/product/123';

		let currentElement: HTMLElement = parentElement;
		for (let i = 0; i < CLICK_THROUGH_CLOSEST_MAX_LEVELS; i++) {
			const childElement = document.createElement('span');
			currentElement.appendChild(childElement);
			currentElement = childElement;
		}

		Object.defineProperty(e, 'target', { value: currentElement });

		expect(isClickWithinProductLink(e, result)).toBe(false);
	});

	it('should return true if href is found within max levels', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const parentElement = document.createElement('a');
		parentElement.href = 'https://www.example.com/product/123';

		let currentElement: HTMLElement = parentElement;
		for (let i = 0; i < CLICK_THROUGH_CLOSEST_MAX_LEVELS - 1; i++) {
			const childElement = document.createElement('span');
			currentElement.appendChild(childElement);
			currentElement = childElement;
		}

		Object.defineProperty(e, 'target', { value: currentElement });

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should return false if the result url doesnt match the href', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/different-url';
		Object.defineProperty(e, 'target', { value: targetElement });

		expect(isClickWithinProductLink(e, result)).toBe(false);
	});

	it('should return true if the result url includes the href', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/product/123?variant=3';
		Object.defineProperty(e, 'target', { value: targetElement });

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should handle result with direct mappings.core.url', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/product/123';
		Object.defineProperty(e, 'target', { value: targetElement });

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});
});
