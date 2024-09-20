import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { createHoverProps } from './createHoverProps';

const wait = (time?: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('createHoverProps', () => {
	it('calls the callback provided after the default time', async () => {
		const callback = jest.fn();
		const delay = 333;
		const hoverProps = createHoverProps(callback, { delay, focusElem: false });

		// @ts-ignore --- testing-library doesn't like the types
		const rendered = render(<div className="hover-element" {...hoverProps}></div>);

		const element = rendered.container.querySelector('.hover-element');
		userEvent.hover(element!);

		await wait(delay + 200);

		expect(callback).toHaveBeenCalled();
		expect(element).not.toHaveFocus();
	});

	it('does not call the callback provided if hover stops before delay', async () => {
		const callback = jest.fn();
		const delay = 333;
		const hoverProps = createHoverProps(callback, { delay });

		// @ts-ignore --- testing-library doesn't like the types
		const rendered = render(<div className="hover-element" {...hoverProps}></div>);

		const element = rendered.container.querySelector('.hover-element');
		userEvent.hover(element!);

		// don't wait the full delay, then unhover
		await wait(delay - 200);

		userEvent.unhover(element!);

		expect(callback).not.toHaveBeenCalled();
	});
});
