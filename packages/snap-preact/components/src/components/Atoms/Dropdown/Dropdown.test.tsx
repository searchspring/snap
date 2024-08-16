import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Dropdown } from './Dropdown';
import { ThemeProvider } from '../../../providers';
import { A11Y_ATTRIBUTE } from '../../../hooks/useA11y';

describe('Dropdown Component', () => {
	it('renders', () => {
		const rendered = render(<Dropdown button={'open me'} />);

		const dropdownElement = rendered.container.querySelector('.ss__dropdown');
		expect(dropdownElement).toBeInTheDocument();
		expect(dropdownElement?.classList).toHaveLength(2);
	});

	it('renders with className prop', () => {
		const className = 'classy';
		const rendered = render(<Dropdown button={'open me'} className={className} />);

		const dropdownElement = rendered.container.querySelector(`.ss__dropdown.${className}`);
		expect(dropdownElement).toBeInTheDocument();
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<Dropdown button={'open me'} style={style} />);
		const dropdownElement = rendered.container.querySelector('.ss__dropdown')!;

		const styles = getComputedStyle(dropdownElement);

		expect(styles.padding).toBe(style.padding);
	});

	it('renders button prop', () => {
		const buttonText = 'click me';
		const rendered = render(<Dropdown button={buttonText} />);

		const buttonElement = rendered.getByText(buttonText);
		expect(buttonElement).toBeInTheDocument();
	});

	it('renders content prop', () => {
		const contentText = 'this is the content';
		const rendered = render(<Dropdown button={'open me'} content={contentText} />);

		const contentElement = rendered.getByText(contentText);
		expect(contentElement).toBeInTheDocument();
	});

	it('renders children prop', () => {
		const child = 'this is the child';
		const rendered = render(<Dropdown button={'open me'}>{child}</Dropdown>);

		const childElement = rendered.getByText(child);
		expect(childElement).toBeInTheDocument();
	});

	it('Can enable/disable useAlly with disableA11y prop', () => {
		const child = 'this is the child';
		const rendered = render(<Dropdown button={'open me'}>{child}</Dropdown>);

		const buttonElement = rendered.container.querySelector('.ss__dropdown__button');

		expect(buttonElement).toBeInTheDocument();

		expect(buttonElement).toHaveAttribute(A11Y_ATTRIBUTE);

		const rendered2 = render(
			<Dropdown button={'open me'} disableA11y>
				{child}
			</Dropdown>
		);

		const buttonElement2 = rendered2.container.querySelector('.ss__dropdown__button');
		expect(buttonElement2).not.toHaveAttribute(A11Y_ATTRIBUTE);
	});

	it('renders content and children props', () => {
		const contentText = 'this is the content';
		const child = 'this is the child';
		const rendered = render(
			<Dropdown button={'open me'} content={contentText}>
				{child}
			</Dropdown>
		);

		const buttonElement = rendered.getByText(contentText + child);
		expect(buttonElement).toBeInTheDocument();
	});

	it('renders button prop with props', async () => {
		const Button = ({ open }: { open?: boolean }) => {
			return <div className="button-with-props">{open ? 'close' : 'open'} me</div>;
		};
		const rendered = render(<Dropdown button={<Button />}></Dropdown>);

		let buttonElement = rendered.container.querySelector('.button-with-props');
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement?.innerHTML).toBe('open me');

		await (buttonElement as HTMLElement).click();

		buttonElement = rendered.container.querySelector('.button-with-props');
		expect(buttonElement?.innerHTML).toBe('close me');
	});

	it('renders children prop with props', async () => {
		const Child = ({ open, toggleOpen }: { open?: boolean; toggleOpen?: () => void }) => {
			return (
				<div
					className="child-with-props"
					onClick={() => {
						toggleOpen && toggleOpen();
					}}
				>
					im {open ? 'open' : 'closed'}
				</div>
			);
		};
		const rendered = render(
			<Dropdown button={'open me'}>
				<Child />
			</Dropdown>
		);

		const buttonElement = rendered.getByText('open me');
		expect(buttonElement).toBeInTheDocument();

		let childElement = rendered.container.querySelector('.child-with-props');
		expect(childElement).toBeInTheDocument();
		expect(childElement?.innerHTML).toBe('im closed');

		await buttonElement.click();
		childElement = rendered.container.querySelector('.child-with-props');
		expect(childElement?.innerHTML).toBe('im open');

		await (childElement as HTMLElement).click();
		childElement = rendered.container.querySelector('.child-with-props');
		expect(childElement?.innerHTML).toBe('im closed');
	});

	it('renders content prop with props', async () => {
		const Content = ({ open, toggleOpen }: { open?: boolean; toggleOpen?: () => void }) => {
			return (
				<div
					className="content-with-props"
					onClick={() => {
						toggleOpen && toggleOpen();
					}}
				>
					im {open ? 'open' : 'closed'}
				</div>
			);
		};
		const rendered = render(<Dropdown button={'open me'} content={<Content />}></Dropdown>);

		const buttonElement = rendered.getByText('open me');
		expect(buttonElement).toBeInTheDocument();

		let contentElement = rendered.container.querySelector('.content-with-props');
		expect(contentElement).toBeInTheDocument();
		expect(contentElement?.innerHTML).toBe('im closed');

		await buttonElement.click();
		contentElement = rendered.container.querySelector('.content-with-props');
		expect(contentElement?.innerHTML).toBe('im open');

		await (contentElement as HTMLElement).click();
		contentElement = rendered.container.querySelector('.content-with-props');
		expect(contentElement?.innerHTML).toBe('im closed');
	});

	it('fires onToggle prop when clicked outside (while opened)', () => {
		const buttonText = 'click me';
		const contentText = 'this is the content';
		const clickFn = jest.fn();
		const toggleFn = jest.fn();

		const rendered = render(
			<div>
				<span className="outside">outside</span>
				<Dropdown content={contentText} onClick={clickFn} button={buttonText} onToggle={toggleFn} />
			</div>
		);

		const button = rendered.container.querySelector('.ss__dropdown__button')!;
		const outside = rendered.container.querySelector('.outside')!;

		userEvent.click(button);
		expect(clickFn).toHaveBeenCalled();

		userEvent.click(outside);
		expect(toggleFn).toHaveBeenCalled();
	});

	it('does not fire onToggle prop when clicked outside (while opened) when disableClickOutside prop is true', () => {
		const buttonText = 'click me';
		const contentText = 'this is the content';
		const toggleFn = jest.fn();

		const rendered = render(
			<div>
				<span className="outside">outside</span>
				<Dropdown disableClickOutside startOpen content={contentText} button={buttonText} onToggle={toggleFn} />
			</div>
		);

		const outside = rendered.container.querySelector('.outside')!;

		userEvent.click(outside);
		expect(toggleFn).not.toHaveBeenCalled();
	});

	it('fires onClick prop when clicked', () => {
		const clickFn = jest.fn();

		const rendered = render(<Dropdown button={'open me'} onClick={clickFn} />);

		const button = rendered.container.querySelector('.ss__dropdown__button')!;

		userEvent.click(button);
		expect(clickFn).toHaveBeenCalled();
	});

	it('does not fire onClick prop when disabled', () => {
		const clickFn = jest.fn();

		const rendered = render(<Dropdown button={'open me'} disabled onClick={clickFn} />);

		const button = rendered.container.querySelector('.ss__dropdown__button')!;

		userEvent.click(button);
		expect(clickFn).not.toHaveBeenCalled();
	});

	it('disables styles', () => {
		const buttonText = 'click me';
		const contentText = 'this is the content';
		const rendered = render(<Dropdown disableStyles content={contentText} button={buttonText} />);

		const dropdown = rendered.container.querySelector('.ss__dropdown');
		expect(dropdown?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				dropdown: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Dropdown button={'open me'} />
			</ThemeProvider>
		);

		const dropdownElement = rendered.container.querySelector('.ss__dropdown');
		expect(dropdownElement).toHaveClass(globalTheme.components.dropdown.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				dropdown: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<Dropdown button={'open me'} theme={propTheme} />);

		const dropdownElement = rendered.container.querySelector('.ss__dropdown');
		expect(dropdownElement).toHaveClass(propTheme.components.dropdown.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				dropdown: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				dropdown: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Dropdown button={'open me'} theme={propTheme} />
			</ThemeProvider>
		);

		const dropdownElement = rendered.container.querySelector('.ss__dropdown');
		expect(dropdownElement).toHaveClass(propTheme.components.dropdown.className);
		expect(dropdownElement).not.toHaveClass(globalTheme.components.dropdown.className);
	});

	describe('internal state', () => {
		it('fires onToggle prop when clicked', () => {
			const toggleFn = jest.fn();

			const rendered = render(<Dropdown button={'open me'} onToggle={toggleFn} />);

			const button = rendered.container.querySelector('.ss__dropdown__button')!;

			userEvent.click(button);
			expect(toggleFn).toHaveBeenCalled();
		});

		it('does not fire onToggle prop when disabled', () => {
			const toggleFn = jest.fn();

			const rendered = render(<Dropdown button={'open me'} disabled onToggle={toggleFn} />);

			const button = rendered.container.querySelector('.ss__dropdown__button')!;

			userEvent.click(button);
			expect(toggleFn).not.toHaveBeenCalled();
		});

		it('starts closed', () => {
			const rendered = render(<Dropdown button={'open me'} />);

			const dropdown = rendered.container.querySelector('.ss__dropdown');

			expect(dropdown).not.toHaveClass('ss__dropdown--open');
		});

		it('can start open', () => {
			const rendered = render(<Dropdown button={'open me'} startOpen />);

			const dropdown = rendered.container.querySelector('.ss__dropdown');

			expect(dropdown).toHaveClass('ss__dropdown--open');
		});

		it('keeps its own internal state and passes it to onToggle', async () => {
			const toggleFn = jest.fn();

			const rendered = render(<Dropdown button={'open me'} onToggle={toggleFn} />);
			const dropdown = rendered.container.querySelector('.ss__dropdown');
			const button = rendered.container.querySelector('.ss__dropdown__button')!;

			await userEvent.click(button);
			expect(toggleFn).toHaveBeenCalledWith(expect.anything(), true);
			expect(dropdown).toHaveClass('ss__dropdown--open');

			await userEvent.click(button);
			expect(toggleFn).toHaveBeenCalledWith(expect.anything(), false);
			expect(dropdown).not.toHaveClass('ss__dropdown--open');
		});
	});

	describe('external state', () => {
		it('does not fire onToggle prop when clicked', () => {
			const toggleFn = jest.fn();

			const rendered = render(<Dropdown button={'open me'} onToggle={toggleFn} open={true} />);

			const button = rendered.container.querySelector('.ss__dropdown__button')!;

			userEvent.click(button);
			expect(toggleFn).not.toHaveBeenCalled();
		});

		it('uses prop open for state', () => {
			const rendered = render(<Dropdown button={'open me'} open={true} />);

			const dropdown = rendered.container.querySelector('.ss__dropdown');
			expect(dropdown).toHaveClass('ss__dropdown--open');

			rendered.rerender(<Dropdown button={'open me'} open={false} />);
			expect(dropdown).not.toHaveClass('ss__dropdown--open');
		});
	});
});
