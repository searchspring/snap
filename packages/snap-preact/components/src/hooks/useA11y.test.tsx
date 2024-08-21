import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { A11Y_ATTRIBUTE, useA11y } from './useA11y';

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
		expect(Element).toHaveAttribute(A11Y_ATTRIBUTE);
		expect(Element).toHaveAttribute('tabIndex', '0');

		userEvent.tab();

		expect(Element).toHaveFocus();

		userEvent.keyboard('{Enter}');
		expect(clickFunc).toHaveBeenCalled();
		//spacebar
		userEvent.keyboard(' ');
		expect(clickFunc).toHaveBeenCalledTimes(2);

		userEvent.tab();
		expect(Element).not.toHaveFocus();
	});

	it('can pass tab index', () => {
		let clickFunc = jest.fn();
		let tabindex = 1;
		const rendered = render(
			<div onClick={clickFunc} id="findMe" ref={(e) => useA11y(e, tabindex)}>
				test
			</div>
		);

		expect(rendered.container).toBeInTheDocument();

		const Element = rendered.container.querySelector('#findMe');
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveAttribute(A11Y_ATTRIBUTE);
		expect(Element).toHaveAttribute('tabIndex', `${tabindex}`);

		userEvent.tab();

		expect(Element).toHaveFocus();
	});
});
