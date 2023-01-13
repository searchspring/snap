import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { useA11y } from './useA11y';

describe('useA11y hook', () => {
	it('can use the hook and get the attributes and eventlisteners', () => {
		let clickFunc = jest.fn();
		const rendered = render(
			<div onClick={clickFunc} id="findMe" ref={(e) => useA11y(e)}>
				test
			</div>
		);

		expect(rendered.container).toBeInTheDocument();

		const Element = rendered.container.querySelector('#findMe');
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveAttribute('ssA11y');
		expect(Element).toHaveAttribute('tabIndex', '0');

		userEvent.tab();

		expect(Element).toHaveFocus();
		expect(Element).toHaveStyle('outline: -webkit-focus-ring-color auto 1px');

		userEvent.keyboard('{Enter}');
		expect(clickFunc).toHaveBeenCalled();
		//spacebar
		userEvent.keyboard(' ');
		expect(clickFunc).toHaveBeenCalledTimes(2);

		userEvent.tab();
		expect(Element).not.toHaveFocus();
		expect(Element).not.toHaveStyle('outline: -webkit-focus-ring-color auto 1px');
	});

	it('can pass tab index and focus ring color ', () => {
		let clickFunc = jest.fn();
		let tabindex = 1;
		let focusRingColor = 'red';
		const rendered = render(
			<div onClick={clickFunc} id="findMe" ref={(e) => useA11y(e, tabindex, focusRingColor)}>
				test
			</div>
		);

		expect(rendered.container).toBeInTheDocument();

		const Element = rendered.container.querySelector('#findMe');
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveAttribute('ssA11y');
		expect(Element).toHaveAttribute('tabIndex', `${tabindex}`);

		userEvent.tab();

		expect(Element).toHaveFocus();
		expect(Element).toHaveStyle(`outline: ${focusRingColor} auto 1px`);
	});
});
