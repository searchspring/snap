import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';
import { ThemeProvider } from '../../../providers';
import { A11Y_ATTRIBUTE } from '../../../hooks/useA11y';

describe('Modal Component', () => {
	it('renders', () => {
		expect(true).toBe(true);
	});

	it('renders with className prop', () => {
		const className = 'classy';
		const rendered = render(<Modal button={'open me'} className={className} />);

		const modalElement = rendered.container.querySelector(`.ss__modal.${className}`);
		expect(modalElement).toBeInTheDocument();
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<Modal button={'open me'} style={style} />);
		const modalElement = rendered.container.querySelector('.ss__modal')!;

		const styles = getComputedStyle(modalElement);

		expect(styles.padding).toBe(style.padding);
	});

	it('renders button prop', () => {
		const buttonText = 'click me';
		const rendered = render(<Modal button={buttonText} />);

		const buttonElement = rendered.getByText(buttonText);
		expect(buttonElement).toBeInTheDocument();
	});

	it('can use buttonSelector prop', async () => {
		const child = 'this is the child';
		document.body.innerHTML = '<div id="clickMe">Some Other Button</div>';
		const rendered = render(<Modal buttonSelector={'#clickMe'}>{child}</Modal>);

		const otherButtonElement = document.body.querySelector('#clickMe');
		let childElement = rendered.queryByText(child);

		expect(childElement).not.toBeInTheDocument();

		await userEvent.click(otherButtonElement!);
		childElement = rendered.queryByText(child);

		expect(childElement).toBeInTheDocument();
	});

	it('renders content prop', async () => {
		const contentText = 'this is the content';

		const rendered = render(<Modal button={'open me'} content={contentText} />);

		const buttonElement = rendered.container.querySelector('.ss__modal__button');

		await userEvent.click(buttonElement!);

		const contentElement = rendered.getByText(contentText);
		expect(contentElement).toBeInTheDocument();
	});

	it('renders children prop', async () => {
		const child = 'this is the child';
		const rendered = render(<Modal button={'open me'}>{child}</Modal>);
		const buttonElement = rendered.container.querySelector('.ss__modal__button');

		await userEvent.click(buttonElement!);

		const childElement = rendered.getByText(child);
		expect(childElement).toBeInTheDocument();
	});

	it('Can enable/disable useAlly with disableA11y prop', () => {
		const child = 'this is the child';
		const rendered = render(<Modal button={'open me'}>{child}</Modal>);

		const buttonElement = rendered.container.querySelector('.ss__modal__button');

		expect(buttonElement).toBeInTheDocument();

		expect(buttonElement).toHaveAttribute(A11Y_ATTRIBUTE);

		const rendered2 = render(
			<Modal button={'open me'} disableA11y>
				{child}
			</Modal>
		);

		const buttonElement2 = rendered2.container.querySelector('.ss__modal__button');
		expect(buttonElement2).not.toHaveAttribute(A11Y_ATTRIBUTE);
	});

	it('renders content and children props', async () => {
		const contentText = 'this is the content';
		const child = 'this is the child';
		const rendered = render(
			<Modal button={'open me'} content={contentText}>
				{child}
			</Modal>
		);

		const _buttonElement = rendered.container.querySelector('.ss__modal__button');

		await userEvent.click(_buttonElement!);

		const buttonElement = rendered.getByText(contentText + child);
		expect(buttonElement).toBeInTheDocument();
	});

	it('renders button prop with props', async () => {
		const Button = ({ open }: { open?: boolean }) => {
			return <div className="button-with-props">{open ? 'close' : 'open'} me</div>;
		};
		const rendered = render(<Modal button={<Button />}></Modal>);

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
			<Modal button={'open me'}>
				<Child />
			</Modal>
		);

		const buttonElement = rendered.container.querySelector('.ss__modal__button');
		expect(buttonElement).toBeInTheDocument();

		let childElement = rendered.container.querySelector('.child-with-props');
		expect(childElement).not.toBeInTheDocument();

		await userEvent.click(buttonElement!);

		childElement = rendered.container.querySelector('.child-with-props');
		expect(childElement).toBeInTheDocument();
		expect(childElement?.innerHTML).toBe('im open');

		await userEvent.click(childElement!);

		childElement = rendered.container.querySelector('.child-with-props');
		expect(childElement).not.toBeInTheDocument();
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
		const rendered = render(<Modal button={'open me'} content={<Content />}></Modal>);

		const buttonElement = rendered.container.querySelector('.ss__modal__button');
		expect(buttonElement).toBeInTheDocument();

		let contentElement = rendered.container.querySelector('.content-with-props');
		expect(contentElement).not.toBeInTheDocument();

		await userEvent.click(buttonElement!);

		contentElement = rendered.container.querySelector('.content-with-props');
		expect(contentElement).toBeInTheDocument();
		expect(contentElement?.innerHTML).toBe('im open');

		await userEvent.click(contentElement!);

		contentElement = rendered.container.querySelector('.content-with-props');
		expect(contentElement).not.toBeInTheDocument();
	});

	it('fires onClick prop when clicked', () => {
		const clickFn = jest.fn();

		const rendered = render(<Modal button={'open me'} onClick={clickFn} />);

		const button = rendered.container.querySelector('.ss__modal__button')!;

		userEvent.click(button);
		expect(clickFn).toHaveBeenCalled();
	});

	it('does not fire onClick prop when disabled', () => {
		const clickFn = jest.fn();

		const rendered = render(<Modal button={'open me'} disabled onClick={clickFn} />);

		const button = rendered.container.querySelector('.ss__modal__button')!;

		userEvent.click(button);
		expect(clickFn).not.toHaveBeenCalled();
	});

	it('disables styles', () => {
		const buttonText = 'click me';
		const contentText = 'this is the content';
		const rendered = render(<Modal disableStyles content={contentText} button={buttonText} />);

		const modal = rendered.container.querySelector('.ss__modal');
		expect(modal?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				modal: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Modal button={'open me'} />
			</ThemeProvider>
		);

		const modalElement = rendered.container.querySelector('.ss__modal');
		expect(modalElement).toHaveClass(globalTheme.components.modal.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				modal: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<Modal button={'open me'} theme={propTheme} />);

		const modalElement = rendered.container.querySelector('.ss__modal');
		expect(modalElement).toHaveClass(propTheme.components.modal.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				modal: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				modal: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Modal button={'open me'} theme={propTheme} />
			</ThemeProvider>
		);

		const modalElement = rendered.container.querySelector('.ss__modal');
		expect(modalElement).toHaveClass(propTheme.components.modal.className);
		expect(modalElement).not.toHaveClass(globalTheme.components.modal.className);
	});

	describe('internal state', () => {
		it('starts closed', () => {
			const rendered = render(<Modal button={'open me'} />);

			const modal = rendered.container.querySelector('.ss__modal');

			expect(modal).not.toHaveClass('ss__modal--open');
		});

		it('can start open', () => {
			const rendered = render(<Modal button={'open me'} startOpen />);

			const modal = rendered.container.querySelector('.ss__modal');

			expect(modal).toHaveClass('ss__modal--open');
		});
	});

	describe('external state', () => {
		it('uses prop open for state', () => {
			const rendered = render(<Modal button={'open me'} open={true} />);

			const modal = rendered.container.querySelector('.ss__modal');
			expect(modal).toHaveClass('ss__modal--open');

			rendered.rerender(<Modal button={'open me'} open={false} />);
			expect(modal).not.toHaveClass('ss__modal--open');
		});
	});
});
