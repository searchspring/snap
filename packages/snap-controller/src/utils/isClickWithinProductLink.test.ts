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

		// Mock composedPath to return the element
		Object.defineProperty(e, 'composedPath', {
			value: () => [targetElement],
		});

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

		// Mock composedPath to return the path from child to parent
		Object.defineProperty(e, 'composedPath', {
			value: () => [childElement, parentElement],
		});

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should return false if no matching href is found within max levels', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const parentElement = document.createElement('a');
		parentElement.href = 'https://www.example.com/product/123';

		const path: HTMLElement[] = [];
		let currentElement: HTMLElement = parentElement;
		for (let i = 0; i < CLICK_THROUGH_CLOSEST_MAX_LEVELS; i++) {
			const childElement = document.createElement('span');
			currentElement.appendChild(childElement);
			currentElement = childElement;
			path.push(currentElement);
		}
		// Add the parent element beyond the max levels
		path.push(parentElement);

		// Mock composedPath to return path that has the link beyond max levels
		Object.defineProperty(e, 'composedPath', {
			value: () => path,
		});

		expect(isClickWithinProductLink(e, result)).toBe(false);
	});

	it('should return true if href is found within max levels', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const parentElement = document.createElement('a');
		parentElement.href = 'https://www.example.com/product/123';

		const path: HTMLElement[] = [];
		let currentElement: HTMLElement = parentElement;
		for (let i = 0; i < CLICK_THROUGH_CLOSEST_MAX_LEVELS - 1; i++) {
			const childElement = document.createElement('span');
			currentElement.appendChild(childElement);
			currentElement = childElement;
			path.push(currentElement);
		}
		// Add the parent element at the boundary of max levels
		path.push(parentElement);

		// Mock composedPath to return path with link at max level boundary
		Object.defineProperty(e, 'composedPath', {
			value: () => path,
		});

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should return false if the result url doesnt match the href', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/different-url';

		// Mock composedPath to return the element
		Object.defineProperty(e, 'composedPath', {
			value: () => [targetElement],
		});

		expect(isClickWithinProductLink(e, result)).toBe(false);
	});

	it('should return true if the result url includes the href', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/product/123?variant=3';

		// Mock composedPath to return the element
		Object.defineProperty(e, 'composedPath', {
			value: () => [targetElement],
		});

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should handle result with direct mappings.core.url', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/product/123';

		// Mock composedPath to return the element
		Object.defineProperty(e, 'composedPath', {
			value: () => [targetElement],
		});

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should handle clicks originating from within shadow DOM', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		// Create a shadow DOM structure
		const hostElement = document.createElement('div');
		const linkElement = document.createElement('a');
		linkElement.href = 'https://www.example.com/product/123';

		// Simulate a button inside the shadow DOM that's inside the link
		const shadowButton = document.createElement('button');

		// Mock composedPath to simulate shadow DOM traversal
		// The path includes elements from within the shadow DOM and crosses the shadow boundary
		Object.defineProperty(e, 'composedPath', {
			value: () => [shadowButton, linkElement, hostElement, document.body, document.documentElement],
		});

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});

	it('should fallback to target when composedPath is not available', () => {
		const e = new MouseEvent('click');
		const result = createMockProduct('https://www.example.com/product/123');

		const targetElement = document.createElement('a');
		targetElement.href = 'https://www.example.com/product/123';

		// Don't mock composedPath - let it use the fallback
		Object.defineProperty(e, 'target', { value: targetElement });
		Object.defineProperty(e, 'composedPath', { value: undefined });

		expect(isClickWithinProductLink(e, result)).toBe(true);
	});
});
